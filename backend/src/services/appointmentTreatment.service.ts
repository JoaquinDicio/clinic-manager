import { AppError } from "../middlewares/errorMiddleware.js";
import { pool } from "../db/connection.js";
import type { Pool, PoolClient } from "pg";

type Db = Pool | PoolClient;

const appointmentTreatmentsService = {
  async create(
    appointmentId: string,
    treatmentIds: string[],
    db: Db = pool,
  ): Promise<void> {
    if (treatmentIds.length === 0) {
      return;
    }

    const treatments = await db.query(
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
      await db.query(
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

  async replace(
    appointmentId: string,
    treatmentIds: string[],
    db: Db = pool,
  ): Promise<void> {
    await db.query(`DELETE FROM appointment_treatments WHERE appointment_id = $1`, [
      appointmentId,
    ]);

    await this.create(appointmentId, treatmentIds, db);
  },
};

export default appointmentTreatmentsService;
