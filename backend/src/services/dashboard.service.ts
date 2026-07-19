import { pool } from "../db/connection.js"

const dashboardService = {

    async getDashboard() {

        const appointmentsToday = await pool.query(`
                SELECT COUNT(*)
                FROM appointments
                WHERE date = CURRENT_DATE`)

        const pendingMessages = await pool.query(`
                SELECT COUNT(*)
                FROM schedules
                WHERE status = 'pending'`)

        const sentToday = await pool.query(`
                SELECT COUNT(*)
                FROM schedules
                WHERE status = 'sent'
                AND DATE(send_at) = CURRENT_DATE`)

        const upcomingSchedules = await pool.query(`
            SELECT 
                s.id,
                s.send_at,
                s.status,
                c.name,
                c.phone
            FROM schedules s
            JOIN clients c ON c.id = s.client_id
            WHERE s.status = 'pending'
            ORDER BY s.send_at ASC
            LIMIT 10
        `)

        return {
            appointmentsToday: Number(appointmentsToday.rows[0].count),
            pendingMessages: Number(pendingMessages.rows[0].count),
            sentToday: Number(sentToday.rows[0].count),
            upcomingSchedules: upcomingSchedules.rows
        }
    }
}

export default dashboardService