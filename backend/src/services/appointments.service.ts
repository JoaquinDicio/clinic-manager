import schedulesService from "./schedules.service.js"
import { Appointment } from "../db/db.js"
import { AppError } from "../middlewares/errorMiddleware.js"
import { CreateAppointmentDTO } from "../validators/appointment.validator.js"
import { pool } from "../db/connection.js"

const appointmentsService = {

    async get(): Promise<Appointment[]> {
        const result = await pool.query('SELECT * FROM appointments ORDER BY date DESC')
        return result.rows
    },

    async create(data: CreateAppointmentDTO): Promise<Appointment> {

        const { clientId, date, time, reminder, slots } = data

        const client = await pool.query(
            'SELECT id FROM clients WHERE id = $1',
            [clientId]
        )

        if (!client.rows[0]) {
            throw new AppError(404, 'Client not found in DB')
        }

        const result = await pool.query(
            `INSERT INTO appointments (client_id, date, time, reminder, slots)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
            [clientId, date, time, reminder ?? true, slots]
        )

        const newAppointment = result.rows[0]

        if (reminder) {

            const [year, month, day] = date.split("-").map(Number)
            const [hour, minute] = time.split(":").map(Number)

            // Argentina UTC-3
            const appointmentDate = new Date(Date.UTC(
                year,
                month - 1,
                day,
                hour + 3,
                minute,
                0
            ))

            const reminderDate = new Date(appointmentDate)
            reminderDate.setUTCDate(reminderDate.getUTCDate() - 1)

            if (reminderDate > new Date()) {

                await schedulesService.create({
                    templateId: "3caa67b3-7dc6-4a1f-a51f-5f6e47cfa3be",
                    clientId,
                    sendAt: reminderDate.toISOString(),
                    variables: {
                        fecha: date,
                        hora: time
                    }
                })
            }
        }

        return newAppointment
    },

    async update(newData: CreateAppointmentDTO, id: string): Promise<Appointment> {

        const { clientId, date, time, reminder } = newData

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
            [clientId, date, time, reminder, id]
        )

        if (!result.rows[0]) {
            throw new AppError(404, "Appointment not found")
        }

        return result.rows[0]
    },

    async delete(id: string): Promise<void> {

        await pool.query(
            `DELETE FROM schedules WHERE appointment_id = $1`,
            [id]
        )

        const result = await pool.query(
            `DELETE FROM appointments WHERE id = $1`,
            [id]
        )

        if (result.rowCount === 0) {
            throw new AppError(404, "Appointment not found")
        }
    }
}

export default appointmentsService