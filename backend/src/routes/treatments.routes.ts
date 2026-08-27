import { Router } from "express";
import treatmentsController from "../controllers/treatments.controller.js";

const treatmentsRouter = Router();

treatmentsRouter.get("/", treatmentsController.getAll);
treatmentsRouter.post("/", treatmentsController.create);
treatmentsRouter.delete("/:id", treatmentsController.delete);

export default treatmentsRouter;
