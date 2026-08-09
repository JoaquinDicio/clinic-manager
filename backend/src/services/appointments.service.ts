import schedulesService from "./schedules.service.js";
import { Appointment, AppointmentWithClient } from "../db/db.js";
import { AppError } from "../middlewares/errorMiddleware.js";
import { CreateAppointmentDTO } from "../validators/appointment.validator.js";
import { pool } from "../db/connection.js";

interface AppointmentsWithClient extends Appointment {
  client: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
}

const appointmentsService = {
  async get(): Promise<Appointment[]> {
    const result = await pool.query(
      "SELECT * FROM appointments ORDER BY date DESC",
    );
    return result.rows;
  },

  async getAppointmentsWithClient(): Promise<AppointmentsWithClient[]> {
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

    const appointments = result.rows.map((appointment) => ({
      ...appointment,
      formattedDate: appointment.date.toLocaleDateString(),
    }));

    return appointments;
  },

  async create(data: CreateAppointmentDTO): Promise<AppointmentWithClient> {
    const { clientId, date, time, reminder, slots, templateId } = data;

    const client = await pool.query("SELECT id FROM clients WHERE id = $1", [
      clientId,
    ]);

    if (!client.rows[0]) {
      throw new AppError(404, "Client not found in DB");
    }

    const result = await pool.query(
      `INSERT INTO appointments (client_id, date, time, reminder, slots)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
      [clientId, date, time, reminder ?? true, slots],
    );

    const appointmentId = result.rows[0].id;

    const shouldReminder = reminder ?? true;

    if (shouldReminder && templateId) {
      const [year, month, day] = date.split("-").map(Number);
      const [hour, minute] = time.split(":").map(Number);

      // Argentina UTC-3
      const appointmentDate = new Date(
        Date.UTC(year, month - 1, day, hour + 3, minute, 0),
      );

      const reminderDate = new Date(appointmentDate);
      reminderDate.setUTCDate(reminderDate.getUTCDate() - 1);

      if (reminderDate > new Date()) {
        await schedulesService.create({
          templateId,
          clientId,
          sendAt: reminderDate.toISOString(),
          variables: {
            fecha: date,
            hora: time,
          },
        });
      }
    }

    const appointment = await pool.query(
      `
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
    JOIN clients c ON c.id = a.client_id
    WHERE a.id = $1
    `,
      [appointmentId],
    );

    return appointment.rows[0];
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
