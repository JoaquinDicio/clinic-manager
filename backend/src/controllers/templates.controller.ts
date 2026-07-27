import { Request, Response } from "express"
import templatesService from "../services/templates.service.js"
import { TemplateDTO } from "../types/templates.types.js"
import { AppError } from "../middlewares/errorMiddleware.js"
import { CreateTemplateSchema } from "../validators/template.validator.js"

const templatesController = {

    async getAll(req: Request, res: Response) {
        const templates = await templatesService.getAll()
        res.status(200).json(templates)
    },

    async create(req: Request, res: Response) {
        const result = CreateTemplateSchema.safeParse(req.body);

        if (!result.success) {
            throw new AppError(400, result.error.issues[0].message)
        }

        const response = await templatesService.create({ ...result.data })
        res.status(201).json(response)
    },

    async update(req: Request, res: Response) {
        const id = req.params.id as string
        const { name, body, variables }: TemplateDTO = req.body

        const response = await templatesService.update({ name, body, variables }, id)
        res.status(200).json(response)
    },

    async delete(req: Request, res: Response) {
        const id = req.params.id as string
        await templatesService.delete(id)
        res.status(204).send()
    }
}

export default templatesController