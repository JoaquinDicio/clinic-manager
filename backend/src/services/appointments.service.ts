import schedulesService from "./schedules.service.js";
import appointmentTreatmentsService from "./appointmentTreatment.service.js";
import {
  Appointment,
  AppointmentFullInfo,
  AppointmentWithClient,
  AppointmentListItem,
} from "../db/db.js";

import { AppError } from "../middlewares/errorMiddleware.js";

import {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "../validators/appointment.validator.js";

import { pool } from "../db/connection.js";
import type { Pool, PoolClient } from "pg";

import resolveMessage from "../utils/resolveMessage.js";
import { buildTemplateData } from "../utils/templateData.js";

type Db = Pool | PoolClient;

/*
 * ART (Argentina) es UTC-3 fijo, sin horario de verano desde 2009.
 * Los turnos se cargan en hora local ART: +3 los lleva a UTC.
 */
const ART_OFFSET_HOURS = 3;

const pad2 = (n: number) => String(n).padStart(2, "0");

async function withTransaction<T>(
  fn: (db: PoolClient) => Promise<T>,
): Promise<T> {
  const db = await pool.connect();

  try {
    await db.query("BEGIN");
    const result = await fn(db);
    await db.query("COMMIT");
    return result;
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  } finally {
    db.release();
  }
}

/* SELECT completo: appointment + client + doctor + treatments. */
async function fetchFullInfo(
  db: Db,
  appointmentId: string,
): Promise<AppointmentFullInfo> {
  const appointment = await db.query(
    `
    SELECT
      a.id,
      a.client_id AS "clientId",
      a.doctor_id AS "doctorId",
      a.date,
      a.time,
      a.slots,
      a.reminder,
      a.note,
      a.created_at AS "createdAt",

      json_build_object(
        'id', c.id,
        'name', c.name,
        'phone', c.phone,
        'createdAt', c.created_at
      ) AS client,

      CASE
        WHEN d.id IS NOT NULL THEN
          json_build_object(
            'id', d.id,
            'name', d.name,
            'phone', d.phone,
            'email', d.email,
            'specialty', d.specialty,
            'createdAt', d.created_at
          )
        ELSE NULL
      END AS doctor,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', t.id,
              'name', t.name,
              'description', t.description,
              'price', at.price,
              'active', t.active,
              'createdAt', t.created_at
            )
          )
          FROM appointment_treatments at
          INNER JOIN treatments t
            ON t.id = at.treatment_id
          WHERE at.appointment_id = a.id
        ),
        '[]'
      ) AS treatments

    FROM appointments a

    INNER JOIN clients c
      ON c.id = a.client_id

    LEFT JOIN doctors d
      ON d.id = a.doctor_id

    WHERE a.id = $1
    `,
    [appointmentId],
  );

  if (!appointment.rows[0]) {
    throw new AppError(404, "Appointment not found");
  }

  return appointment.rows[0];
}

const appointmentsService = {
  async get(): Promise<Appointment[]> {
    const result = await pool.query(
      "SELECT * FROM appointments ORDER BY date DESC",
    );

    return result.rows;
  },

  async getAppointmentsWithClient(): Promise<AppointmentWithClient[]> {
    const result = await pool.query(`
      SELECT
        a.id,
        a.client_id AS "clientId",
        a.date,
        a.time,
        a.slots,
        a.reminder,
        a.created_at AS "createdAt",

        json_build_object(
          'id', c.id,
          'name', c.name,
          'phone', c.phone,
          'createdAt', c.created_at
        ) AS client

      FROM appointments a

      INNER JOIN clients c
        ON c.id = a.client_id

      ORDER BY a.date DESC
    `);

    return result.rows;
  },

  async getAppointmentsForList(): Promise<AppointmentListItem[]> {
    const result = await pool.query(`
    SELECT
      a.id,
      a.date,
      a.time,
      a.slots,
      a.reminder,
      a.created_at AS "createdAt",

      json_build_object(
        'id', c.id,
        'name', c.name,
        'phone', c.phone
      ) AS client,

      CASE
        WHEN d.id IS NOT NULL THEN
          json_build_object(
            'id', d.id,
            'name', d.name
          )
        ELSE NULL
      END AS doctor,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', t.id,
              'name', t.name
            )
          )
          FROM appointment_treatments at
          INNER JOIN treatments t
            ON t.id = at.treatment_id
          WHERE at.appointment_id = a.id
        ),
        '[]'
      ) AS treatments

    FROM appointments a

    INNER JOIN clients c
      ON c.id = a.client_id

    LEFT JOIN doctors d
      ON d.id = a.doctor_id

    ORDER BY a.date DESC, a.time ASC
  `);

    return result.rows;
  },

  async create(data: CreateAppointmentDTO): Promise<AppointmentFullInfo> {
    const {
      clientId,
      date,
      time,
      reminder,
      slots,
      templateId,
      doctorId,
      note,
      treatments,
    } = data;

    const client = await pool.query("SELECT id FROM clients WHERE id = $1", [
      clientId,
    ]);

    if (!client.rows[0]) {
      throw new AppError(404, "Client not found in DB");
    }

    /*
     * Variables canónicas de templates, formateadas desde los strings
     * del DTO (sin new Date(): no dependen del TZ del server).
     * {{name}} = cliente, {{date}} = DD/MM/AAAA, {{time}} = HH:MM.
     */
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const formattedDate = `${pad2(day)}/${pad2(month)}/${year}`;
    const formattedTime = `${pad2(hour)}:${pad2(minute)}`;

    return withTransaction(async (db) => {
      const result = await db.query(
        `
    INSERT INTO appointments (
      client_id,
      date,
      time,
      reminder,
      slots,
      doctor_id,
      note
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
    `,
        [clientId, date, time, reminder ?? true, slots, doctorId, note],
      );

      const appointmentId = result.rows[0].id;

      await appointmentTreatmentsService.create(appointmentId, treatments, db);

      /*
       * Obtenemos la información completa del appointment.
       */
      const appointmentData = await fetchFullInfo(db, appointmentId);

      const shouldReminder = reminder ?? true;

      if (shouldReminder && templateId) {
        const template = await db.query(
          "SELECT body FROM templates WHERE id = $1",
          [templateId],
        );

        if (!template.rows[0]) {
          throw new AppError(404, "Template not found in DB");
        }

        const message = resolveMessage(
          template.rows[0].body,
          buildTemplateData(appointmentData, {
            date: formattedDate,
            time: formattedTime,
          }),
        );

        const appointmentDate = new Date(
          Date.UTC(year, month - 1, day, hour + ART_OFFSET_HOURS, minute, 0),
        );

        const reminderDate = new Date(appointmentDate);

        reminderDate.setUTCDate(reminderDate.getUTCDate() - 1);

        if (reminderDate > new Date()) {
          await schedulesService.create(
            {
              templateId,
              clientId,
              appointmentId,
              sendAt: reminderDate.toISOString(),
              body: message,
            },
            db,
          );
        }
      }

      return appointmentData;
    });
  },

  async update(
    newData: UpdateAppointmentDTO,
    id: string,
  ): Promise<AppointmentFullInfo> {
    const {
      clientId,
      doctorId,
      date,
      time,
      slots,
      reminder,
      note,
      treatments,
      templateId,
    } = newData;

    return withTransaction(async (db) => {
      const result = await db.query(
        `
      UPDATE appointments
      SET
        client_id = COALESCE($1, client_id),
        doctor_id = COALESCE($2, doctor_id),
        date = COALESCE($3, date),
        time = COALESCE($4, time),
        slots = COALESCE($5, slots),
        reminder = COALESCE($6, reminder),
        note = COALESCE($7, note)
      WHERE id = $8
      RETURNING id
      `,
        [
          clientId ?? null,
          doctorId ?? null,
          date ?? null,
          time ?? null,
          slots ?? null,
          reminder ?? null,
          note ?? null,
          id,
        ],
      );

      if (!result.rows[0]) {
        throw new AppError(404, "Appointment not found");
      }

      if (treatments !== undefined) {
        await appointmentTreatmentsService.replace(id, treatments, db);
      }

      const scheduleAffectingChange =
        date !== undefined || time !== undefined || reminder !== undefined;

      if (scheduleAffectingChange) {
        // Los recordatorios pendientes apuntan al horario viejo.
        await schedulesService.deletePendingForAppointment(id, db);

        const current = await db.query(
          `SELECT date, time, reminder, client_id FROM appointments WHERE id = $1`,
          [id],
        );
        const row = current.rows[0];

        if (row.reminder && templateId) {
          const full = await fetchFullInfo(db, id);

          const [y, m, d] = (
            row.date instanceof Date
              ? row.date.toISOString().slice(0, 10)
              : String(row.date)
          )
            .split("-")
            .map(Number);
          const [hh, mm] = String(row.time).slice(0, 5).split(":").map(Number);

          const template = await db.query(
            "SELECT body FROM templates WHERE id = $1",
            [templateId],
          );

          if (!template.rows[0]) {
            throw new AppError(404, "Template not found in DB");
          }

          const message = resolveMessage(
            template.rows[0].body,
            buildTemplateData(full, {
              date: `${pad2(d)}/${pad2(m)}/${y}`,
              time: `${pad2(hh)}:${pad2(mm)}`,
            }),
          );

          const appointmentDate = new Date(
            Date.UTC(y, m - 1, d, hh + ART_OFFSET_HOURS, mm, 0),
          );

          const reminderDate = new Date(appointmentDate);

          reminderDate.setUTCDate(reminderDate.getUTCDate() - 1);

          if (reminderDate > new Date()) {
            await schedulesService.create(
              {
                templateId,
                clientId: row.client_id,
                appointmentId: id,
                sendAt: reminderDate.toISOString(),
                body: message,
              },
              db,
            );
          }
        }
      }

      return fetchFullInfo(db, id);
    });
  },

  async delete(id: string): Promise<void> {
    const result = await pool.query(`DELETE FROM appointments WHERE id = $1`, [
      id,
    ]);

    if (result.rowCount === 0) {
      throw new AppError(404, "Appointment not found");
    }
  },
};

export default appointmentsService;
