import cron from "node-cron"
import { pool } from "../db/connection.js"
import whatsappService from "../services/whatsapp.service.js"
import { BulkItem } from "../types/whatsapp.types.js"

function resolveMessage(
    body: string,
    clientName: string,
    variables: Record<string, string> = {}
) {
    return body
        .replace("{{nombre}}", clientName)
        .replace(/{{(\w+)}}/g, (_, key) => variables[key] ?? `{{${key}}}`)
}

async function dispatchPendingSchedules(): Promise<void> {

    const query = `
    SELECT 
      s.id,
      s.variables,
      t.body,
      c.name,
      c.phone
    FROM schedules s
    JOIN clients c ON c.id = s.client_id
    LEFT JOIN templates t ON t.id = s.template_id
    WHERE s.status = 'pending'
    AND s.send_at <= NOW()
  `

    const result = await pool.query(query)

    if (result.rows.length === 0) return

    const bulkWhatsapp: BulkItem[] = []

    for (const row of result.rows) {

        if (!row.body) continue

        const message = resolveMessage(
            row.body,
            row.name,
            row.variables ?? {}
        )

        bulkWhatsapp.push({
            phone: row.phone,
            message,
            scheduleId: row.id
        })

    }

    if (bulkWhatsapp.length === 0) return

    const results = await whatsappService.sendBulkWhatsapp(bulkWhatsapp)

    for (const result of results) {

        const status = result.status === "sent" ? "sent" : "failed"

        await pool.query(
            `UPDATE schedules SET status = $1 WHERE id = $2`,
            [status, result.scheduleId]
        )

    }

}

export function startDispatcher(): void {

    cron.schedule("* * * * *", async () => {
        try {
            await dispatchPendingSchedules()
        } catch (err) {
            console.error("Dispatcher error:", err)
        }
    })

    console.log("Dispatcher started")

}