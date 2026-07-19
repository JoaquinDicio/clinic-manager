import { ClientDTO } from "../types/clients.types.js"
import { AppError } from "../middlewares/errorMiddleware.js"
import { pool } from "../db/connection.js"


export interface Client {
    id: string
    name: string
    phone: string
    created_at: Date
}

const clientsService = {

    async getAll(): Promise<Client[]> {

        const result = await pool.query(`
            SELECT * FROM clients
            ORDER BY created_at DESC
            `)

        return result.rows

    },

    async create(data: ClientDTO): Promise<Client> {

        const result = await pool.query(
            `INSERT INTO clients (name, phone) VALUES ($1, $2) RETURNING *`,
            [data.name, data.phone]
        )

        return result.rows[0]
    },

    async update(newData: ClientDTO, id: string): Promise<Client> {

        const result = await pool.query(
            `
      UPDATE clients
      SET name = $1,
          phone = $2
      WHERE id = $3
      RETURNING *
      `,
            [newData.name, newData.phone, id]
        )

        if (result.rowCount === 0) {
            throw new AppError(404, "Client not found")
        }

        return result.rows[0]
    },

    async delete(id: string): Promise<void> {

        const result = await pool.query(
            `DELETE FROM clients
            WHERE id = $1`,
            [id]
        )

        if (result.rowCount === 0) {
            throw new AppError(404, "Client not found")
        }
    }
}

export default clientsService