import { AppError } from "../middlewares/errorMiddleware.js"
import { pool } from "../db/connection.js"
import { getAvailableTemplateVariables } from "../utils/templateData.js"

export interface Template {
    id: string
    name: string
    body: string
    created_at: Date
}

export interface TemplateDTO {
    name: string
    body: string
}

const templatesService = {

    async getVariables() {
        return getAvailableTemplateVariables()
    },

    async getAll(): Promise<Template[]> {

        const result = await pool.query<Template>(
            `SELECT * FROM templates ORDER BY created_at DESC`
        )

        return result.rows
    },

    async create(data: TemplateDTO): Promise<Template> {

        const result = await pool.query(`INSERT INTO templates (name, body) VALUES ($1, $2) RETURNING *`, [data.name, data.body])

        return result.rows[0]
    },

    async update(newData: TemplateDTO, id: string): Promise<Template> {

        const result = await pool.query<Template>(
            `UPDATE templates
            SET
                name = COALESCE($1, name),
                body = COALESCE($2, body)
            WHERE id = $3
            RETURNING *`,
            [
                newData.name,
                newData.body,
                id
            ]
        )

        if (result.rowCount === 0)
            throw new AppError(404, "Template not found")

        return result.rows[0]
    },

    async delete(id: string): Promise<void> {

        const result = await pool.query(
            `DELETE FROM templates WHERE id = $1`,
            [id]
        )

        if (result.rowCount === 0)
            throw new AppError(404, "Template not found")
    }
}

export default templatesService