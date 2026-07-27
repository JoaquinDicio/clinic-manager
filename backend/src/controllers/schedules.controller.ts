import { Request, Response } from "express"
import schedulesService from "../services/schedules.service.js"
import { CreateScheduleDTO } from "../validators/schedule.validator.js"
import { AppError } from "../middlewares/errorMiddleware.js"

const schedulesController = {

    async getAll(req: Request, res: Response) {
        const schedules = await schedulesService.getAll()
        res.status(200).json(schedules)
    },

    async create(req: Request, res: Response) {

        const { templateId, sendAt, clientId, variables }: CreateScheduleDTO = req.body

        if (!templateId?.trim() || !sendAt?.trim() || !clientId?.trim()) {
            throw new AppError(400, "templateId, sendAt and clientId are required fields")
        }

        const response = await schedulesService.create({
            templateId,
            sendAt,
            clientId,
            variables
        })

        res.status(201).json(response)
    },

    async delete(req: Request, res: Response) {

        const { id } = req.params

        if (!id || typeof id !== "string") {
            throw new AppError(400, "Schedule id is required")
        }

        await schedulesService.delete(id)

        return res.status(204).send()

    }
}

export default schedulesController





