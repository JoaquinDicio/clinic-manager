import { Router } from "express";
import appointmentsController from "../controllers/appointments.controller.js";

const appointmentsRouter = Router();

appointmentsRouter.get("/", appointmentsController.getAll);

appointmentsRouter.post("/", appointmentsController.create);

appointmentsRouter.put("/:id", appointmentsController.create);

appointmentsRouter.delete("/:id", appointmentsController.delete);

export default appointmentsRouter;
