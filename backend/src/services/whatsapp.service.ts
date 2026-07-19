import client from "../config/whatsapp.js";
import { Message, SendResult } from "../types/whatsapp.types.js";

const delay = (ms: number) =>
    new Promise((res) => setTimeout(res, ms)); // we use this to avoid being blocked or banned

const whatsappService = {

    async sendWhatsapp(phone: string, message: string, scheduleId?: string): Promise<SendResult> {

        const id = `${phone}@c.us`

        try {

            await client.sendMessage(id, message)

            return {
                phone,
                scheduleId,
                status: "sent"
            }

        } catch (error) {

            return {
                phone,
                scheduleId,
                status: "failed",
                error
            }

        }
    },

    async sendBulkWhatsapp(messages: Message[]): Promise<SendResult[]> {

        const results: SendResult[] = []

        for (let i = 0; i < messages.length; i++) {

            const msg = messages[i]

            const result = await this.sendWhatsapp(
                msg.phone,
                msg.message,
                msg.scheduleId
            )

            results.push(result)

            const isLast = i === messages.length - 1

            if (!isLast) {
                await delay(500)
            }

        }

        return results
    },

    async getContacts() {
        try {
            const contacts = await client.getContacts()

            const filtered = contacts.filter(c =>
                c.isMyContact &&        // solo los de tu agenda
                c.name?.trim() !== ""   // que tengan nombre
            )

            return { ok: true, filtered }

        } catch (error) {

            console.log(error)

            return { ok: false, error: "Error trying to get Contacts" }
        }
    }
};

export default whatsappService;