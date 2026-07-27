import { Request, Response } from "express"
import clientsService from "../services/clients.service.js"
import { ClientDTO } from "../types/clients.types.js"
import { AppError } from "../middlewares/errorMiddleware.js"
import { CreateClientSchema } from "../validators/client.validator.js"

const clientsController = {

    async getAll(req: Request, res: Response) {

        const clients = await clientsService.getAll()

        res.status(200).json(clients)

    },

    async create(req: Request, res: Response) {

        const result = CreateClientSchema.safeParse(req.body);

        if (!result.success) {
            throw new AppError(400, result.error.issues[0].message)
        }

        const response = await clientsService.create({ ...result.data })

        res.status(201).json(response)

    },

    async update(req: Request, res: Response) {

        const { name, phone }: ClientDTO = req.body

        const id = req.params.id as string

        if (!id?.trim()) {
            throw new AppError(400, "ID cannot be null")
        }

        const response = await clientsService.update({ name, phone }, id)

        return res.status(200).json(response)

    },

    async delete(req: Request, res: Response) {

        const id = req.params.id as string

        await clientsService.delete(id)

        res.status(204).send()

    },
}

export default clientsController