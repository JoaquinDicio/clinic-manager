import { Doctor } from "../db/db.js";
import { pool } from "../db/connection.js";
import { AppError } from "../middlewares/errorMiddleware.js";

const doctorsService = {
  async getAll(): Promise<Doctor[]> {
    const result = await pool.query("SELECT * FROM doctors");
    return result.rows;
  },

  async create({ name, phone, email, specialty }: Doctor): Promise<Doctor> {
    const result = await pool.query(
      `
    INSERT INTO doctors (name, phone, email, specialty)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
      [name, phone, email, specialty],
    );

    return result.rows[0];
  },
  async delete(doctorId: string): Promise<void> {
    const result = await pool.query(`DELETE FROM doctors WHERE id = $1`, [
      doctorId,
    ]);

    if (result.rowCount === 0) {
      throw new AppError(404, "Doctor not found");
    }
  },
};

export default doctorsService;
