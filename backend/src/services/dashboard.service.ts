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
        a.client_id AS "clientId",
        a.date,
        a.time,
        a.slots,
        a.reminder,
        a.created_at AS "createdAt",

        json_build_object(
          'id', c.id,
          'name', c.name,
          'phone', c.phone,
          'createdAt', c.created_at
        ) AS client

      FROM appointments a

      INNER JOIN clients c
        ON c.id = a.client_id

      WHERE a.date = CURRENT_DATE

      ORDER BY a.date ASC, a.time ASC
    `);

    const appointments = todayAppointments.rows.map((appointment) => {
      const [hours, minutes] = appointment.time
        .toString()
        .slice(0, 5)
        .split(":")
        .map(Number);

      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + appointment.slots * 30;

      const formattedTime = `${String(hours).padStart(2, "0")}:${String(
        minutes,
      ).padStart(2, "0")}`;

      const formattedEndTime = `${String(
        Math.floor(endMinutes / 60) % 24,
      ).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

      const date = new Date(appointment.date);

      const formattedDate = date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      return {
        ...appointment,
        formattedDate,
        formattedTime,
        formattedEndTime,
      };
    });

    return {
      appointmentsToday: Number(appointmentsToday.rows[0].count),
      pendingMessages: Number(pendingMessages.rows[0].count),
      sentToday: Number(sentToday.rows[0].count),
      todayAppointments: appointments,
    };
  },
};

export default dashboardService;
