import schedulesService from "./schedules.service.js";
import appointmentTreatmentsService from "./appointmentTreatment.service.js";
import {
  Appointment,
  AppointmentFullInfo,
  AppointmentWithClient,
  AppointmentListItem,
} from "../db/db.js";

import { AppError } from "../middlewares/errorMiddleware.js";

import { CreateAppointmentDTO } from "../validators/appointment.validator.js";

import { pool } from "../db/connection.js";

import resolveMessage from "../utils/resolveMessage.js";

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

    const result = await pool.query(
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

    await appointmentTreatmentsService.create(appointmentId, treatments);

    /*
     * Obtenemos la información completa del appointment.
     */
    const appointment = await pool.query(
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

    const appointmentData = appointment.rows[0];

    const shouldReminder = reminder ?? true;

    if (shouldReminder && templateId) {
      const template = await pool.query(
        "SELECT body FROM templates WHERE id = $1",
        [templateId],
      );

      if (!template.rows[0]) {
        throw new AppError(404, "Template not found in DB");
      }

      const message = resolveMessage(template.rows[0].body, {
        formatted_date: new Date(appointmentData.date).toLocaleDateString(),
        ...appointmentData,
      });

      const [year, month, day] = date.split("-").map(Number);
      const [hour, minute] = time.split(":").map(Number);

      const appointmentDate = new Date(
        Date.UTC(year, month - 1, day, hour + 3, minute, 0),
      );

      const reminderDate = new Date(appointmentDate);

      reminderDate.setUTCDate(reminderDate.getUTCDate() - 1);

      if (reminderDate > new Date()) {
        await schedulesService.create({
          templateId,
          clientId,
          appointmentId,
          sendAt: reminderDate.toISOString(),
          body: message,
        });
      }
    }

    return appointmentData;
  },

  async update(
    newData: CreateAppointmentDTO,
    id: string,
  ): Promise<Appointment> {
    const { clientId, date, time, reminder } = newData;

    const result = await pool.query(
      `
      UPDATE appointments
      SET
        client_id = COALESCE($1, client_id),
        date = COALESCE($2, date),
        time = COALESCE($3, time),
        reminder = COALESCE($4, reminder)
      WHERE id = $5
      RETURNING *
      `,
      [clientId, date, time, reminder, id],
    );

    if (!result.rows[0]) {
      throw new AppError(404, "Appointment not found");
    }

    return result.rows[0];
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
