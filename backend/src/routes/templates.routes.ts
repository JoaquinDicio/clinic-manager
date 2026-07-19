import { Router } from "express"
import templatesController from "../controllers/templates.controller.js"

const templatesRouter = Router()

templatesRouter.get("/", templatesController.getAll)

templatesRouter.post("/", templatesController.create)

templatesRouter.put("/:id", templatesController.update)

templatesRouter.delete("/:id", templatesController.delete)

export default templatesRouter