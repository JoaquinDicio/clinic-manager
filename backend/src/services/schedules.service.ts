import { Schedule } from "../db/db.js"
import { ScheduleDTO } from "../types/schedules.types.js"
import { AppError } from "../middlewares/errorMiddleware.js"
import { pool } from "../db/connection.js"

const schedulesService = {

    async getAll(): Promise<Schedule[]> {

        const result = await pool.query<Schedule>('SELECT * FROM schedules')

        return result.rows
    },

    async create(data: ScheduleDTO): Promise<Schedule> {

        const template = await pool.query(
            `SELECT id FROM templates WHERE id = $1`,
            [data.templateId]
        )

        if (template.rowCount === 0)
            throw new AppError(404, "Template not found")


        const client = await pool.query(
            `SELECT id FROM clients WHERE id = $1`,
            [data.clientId]
        )

        if (client.rowCount === 0)
            throw new AppError(404, `Client ${data.clientId} not found`)


        const result = await pool.query(
            `INSERT INTO schedules (client_id, template_id, send_at, variables, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
            [
                data.clientId,
                data.templateId,
                data.sendAt,
                data.variables ?? {},
                "pending"
            ]
        )

        return result.rows[0]

    },

    async delete(id: string): Promise<void> {

        const result = await pool.query<Schedule>('DELETE FROM schedules WHERE id = $1', [id])

        if (result.rowCount === 0)
            throw new AppError(404, "Schedule not found")

    }
}

export default schedulesService