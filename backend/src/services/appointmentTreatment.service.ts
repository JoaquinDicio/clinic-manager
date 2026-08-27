import { AppError } from "../middlewares/errorMiddleware.js";
import { pool } from "../db/connection.js";

const appointmentTreatmentsService = {
  async create(appointmentId: string, treatmentIds: string[]): Promise<void> {
    if (treatmentIds.length === 0) {
      return;
    }

    const treatments = await pool.query(
      `
      SELECT
        id,
        price
      FROM treatments
      WHERE id = ANY($1)
        AND active = true
      `,
      [treatmentIds],
    );

    if (treatments.rows.length !== treatmentIds.length) {
      throw new AppError(
        404,
        "One or more treatments were not found or are inactive",
      );
    }

    for (const treatment of treatments.rows) {
      await pool.query(
        `
        INSERT INTO appointment_treatments (
          appointment_id,
          treatment_id,
          price
        )
        VALUES ($1, $2, $3)
        `,
        [appointmentId, treatment.id, treatment.price],
      );
    }
  },
};

export default appointmentTreatmentsService;
