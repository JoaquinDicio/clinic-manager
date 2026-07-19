import { Request, Response } from "express"
import { AppError } from "../middlewares/errorMiddleware.js"
import { AppointmentDTO } from "../types/appointments.types.js"
import appointmentsService from "../services/appointments.service.js"

const appointmentsController = {

    async getAll(req: Request, res: Response) {

        const response = await appointmentsService.get()

        res.status(200).json(response)
    },

    async create(req: Request, res: Response) {

        console.log('DATA/////', req.body)

        const data: AppointmentDTO = req.body

        const requiredStrings: (keyof AppointmentDTO)[] = ['clientId', 'date', 'time']

        requiredStrings.forEach((field) => {
            const value = data[field]

            if (typeof value !== "string" || !value.trim()) {
                throw new AppError(400, `Field ${field} is mandatory to send this request.`)
            }
        })

        if (typeof data.slots !== "number" || data.slots <= 0) {
            throw new AppError(400, "Slots must be a positive number")
        }

        if (typeof data.reminder !== "boolean") {
            throw new AppError(400, "Reminder must be boolean")
        }

        const response = await appointmentsService.create(data)

        res.status(201).json(response)
    },

    async delete(req: Request, res: Response) {

        const id = req.params.appointmentId

        if (typeof id !== "string" || !id.trim()) {
            throw new AppError(400, `ID is mandatory to send this request.`)
        }

        await appointmentsService.delete(id)

        res.status(204).send()
    }

}

export default appointmentsController

