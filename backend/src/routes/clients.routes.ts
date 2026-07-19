import { Router } from "express"
import clientController from "../controllers/clients.controller.js"

const clientsRouter = Router()

clientsRouter.get("/", clientController.getAll)

clientsRouter.post("/", clientController.create)

clientsRouter.put("/:id", clientController.update)

clientsRouter.delete("/:id", clientController.delete)

export default clientsRouter 