import { Request, Response } from "express"
import whatsappService from "../services/whatsapp.service.js"
import { WhatsappBulkDTO } from "../types/whatsapp.types.js"
import { isValidMessage, validateBulkPayload } from "../validators/message.validator.js"
import { AppError } from "../middlewares/errorMiddleware.js"

const whatsappController = {

    async postWhatsapp(req: Request, res: Response) {
        const { phone, message } = req.body

        if (!isValidMessage({ phone, message })) {
            throw new AppError(400, 'Invalid message, must be {phone, message}')
        }

        await whatsappService.sendWhatsapp(phone, message)
        res.status(200).json({ ok: true })
    },

    async postBulkWhatsapp(req: Request<{}, {}, WhatsappBulkDTO>, res: Response) {
        const { messages } = req.body

        const invalidMessages = validateBulkPayload(messages)
        if (invalidMessages) {
            throw new AppError(400, invalidMessages)
        }

        const response = await whatsappService.sendBulkWhatsapp(messages)
        res.status(200).json(response)
    },

    async getWhatsappContacts(req: Request, res: Response) {

        const response = await whatsappService.getContacts()

        if (!response.ok) {
            throw new AppError(500, "Error getting contacts info.")
        }

        res.status(200).json(response)
    }
}

export default whatsappController