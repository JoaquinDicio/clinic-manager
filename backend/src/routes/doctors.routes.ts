import { Router } from "express";
import doctorsController from "../controllers/doctors.controller.js";

const doctorsRouter = Router();

doctorsRouter.get("/", doctorsController.getAll);

doctorsRouter.post("/", doctorsController.create);

doctorsRouter.delete("/:id", doctorsController.delete);

export default doctorsRouter;
