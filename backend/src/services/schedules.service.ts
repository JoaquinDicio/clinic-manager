import { Schedule } from "../db/db.js";
import { CreateScheduleDTO } from "../validators/schedule.validator.js";
import { AppError } from "../middlewares/errorMiddleware.js";
import { pool } from "../db/connection.js";
import type { Pool, PoolClient } from "pg";

type Db = Pool | PoolClient;

const schedulesService = {
  async getAll(): Promise<Schedule[]> {
    const result = await pool.query<Schedule>("SELECT * FROM schedules");

    const schedules = result.rows.map((schedule) => ({
      ...schedule,
      formattedSendAt: new Date(schedule.send_at).toLocaleString(),
    }));

    return schedules;
  },

  async getPending(): Promise<Schedule[]> {
    const result = await pool.query<Schedule>(
      "SELECT * FROM schedules WHERE status = $1",
      ["pending"],
    );

    return result.rows;
  },

  async create(data: CreateScheduleDTO, db: Db = pool): Promise<Schedule> {
    const template = await db.query(
      `SELECT id FROM templates WHERE id = $1`,
      [data.templateId],
    );

    if (template.rowCount === 0) {
      throw new AppError(404, "Template not found");
    }

    const client = await db.query(`SELECT id FROM clients WHERE id = $1`, [
      data.clientId,
    ]);

    if (client.rowCount === 0) {
      throw new AppError(404, `Client ${data.clientId} not found`);
    }

    const result = await db.query(
      `
      INSERT INTO schedules (
        client_id,
        appointment_id,
        template_id,
        body,
        send_at,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [
        data.clientId,
        data.appointmentId ?? null,
        data.templateId,
        data.body,
        data.sendAt,
        "pending",
      ],
    );

    return result.rows[0];
  },

  async deletePendingForAppointment(
    appointmentId: string,
    db: Db = pool,
  ): Promise<void> {
    await db.query(
      `DELETE FROM schedules WHERE appointment_id = $1 AND status = 'pending'`,
      [appointmentId],
    );
  },

  async delete(id: string): Promise<void> {
    const result = await pool.query<Schedule>(
      "DELETE FROM schedules WHERE id = $1",
      [id],
    );

    if (result.rowCount === 0) throw new AppError(404, "Schedule not found");
  },
};

export default schedulesService;
