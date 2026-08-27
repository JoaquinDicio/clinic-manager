import { type Treatment } from "../db/db.js";
import { AppError } from "../middlewares/errorMiddleware.js";
import { pool } from "../db/connection.js";

interface TreatmentDTO {
  name: string;
  description: string;
  price: number;
  active: boolean;
}

const treatmentsService = {
  async getAll(): Promise<Treatment[]> {
    const result = await pool.query(`
    SELECT
      id,
      name,
      description,
      price,
      active,
      created_at AS "createdAt"
    FROM treatments
    WHERE active = true
    ORDER BY created_at DESC
  `);

    return result.rows;
  },

  async create(data: TreatmentDTO): Promise<Treatment> {
    const { name, description, price, active } = data;

    const result = await pool.query(
      `
      INSERT INTO treatments (
        name,
        description,
        price,
        active
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        name,
        description,
        price,
        active,
        created_at AS "createdAt"
      `,
      [name, description, price, active],
    );

    return result.rows[0];
  },

  async delete(id: string): Promise<void> {
    const result = await pool.query(
      `
    UPDATE treatments
    SET active = false
    WHERE id = $1
    `,
      [id],
    );

    if (result.rowCount === 0) {
      throw new AppError(404, "Treatment not found");
    }
  },
};

export default treatmentsService;
