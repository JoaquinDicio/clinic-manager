import { Router } from "express"
import schedulesController from "../controllers/schedules.controller.js"

const schedulesRouter = Router()

schedulesRouter.get("/", schedulesController.getAll)

schedulesRouter.post("/", schedulesController.create)

schedulesRouter.delete("/:id", schedulesController.delete)

export default schedulesRouter 