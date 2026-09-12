import { pool } from "../db/connection.js";

const dashboardService = {
  async getDashboard() {
    const appointmentsToday = await pool.query(`
      SELECT COUNT(*)
      FROM appointments
      WHERE date = CURRENT_DATE
    `);

    const pendingMessages = await pool.query(`
      SELECT COUNT(*)
      FROM schedules
      WHERE status = 'pending'
    `);

    const sentToday = await pool.query(`
      SELECT COUNT(*)
      FROM schedules
      WHERE status = 'sent'
      AND DATE(send_at) = CURRENT_DATE
    `);

    const todayAppointments = await pool.query(`
      SELECT
        a.id,
        a.date,
        a.time,
        a.slots,
        a.reminder,
        a.created_at AS "createdAt",

        json_build_object(
          'id', c.id,
          'name', c.name,
          'phone', c.phone
        ) AS client,

        CASE
          WHEN d.id IS NOT NULL THEN
            json_build_object(
              'id', d.id,
              'name', d.name
            )
          ELSE NULL
        END AS doctor,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', t.id,
                'name', t.name
              )
            )
            FROM appointment_treatments at
            INNER JOIN treatments t
              ON t.id = at.treatment_id
            WHERE at.appointment_id = a.id
          ),
          '[]'
        ) AS treatments

      FROM appointments a

      INNER JOIN clients c
        ON c.id = a.client_id

      LEFT JOIN doctors d
        ON d.id = a.doctor_id

      WHERE a.date = CURRENT_DATE

      ORDER BY a.date ASC, a.time ASC
    `);

    return {
      appointmentsToday: Number(appointmentsToday.rows[0].count),
      pendingMessages: Number(pendingMessages.rows[0].count),
      sentToday: Number(sentToday.rows[0].count),
      todayAppointments: todayAppointments.rows,
    };
  },
};

export default dashboardService;
