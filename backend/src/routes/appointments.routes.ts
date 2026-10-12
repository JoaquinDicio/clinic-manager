import { Router } from "express";
import appointmentsController from "../controllers/appointments.controller.js";

const appointmentsRouter = Router();

appointmentsRouter.get("/", appointmentsController.getAll);

appointmentsRouter.post("/", appointmentsController.create);

appointmentsRouter.put("/:id", appointmentsController.update);

appointmentsRouter.delete("/:id", appointmentsController.delete);

export default appointmentsRouter;
