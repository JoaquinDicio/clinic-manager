import { Request, Response } from "express";
import { AppError } from "../middlewares/errorMiddleware.js";
import treatmentsService from "../services/treatments.service.js";
import { CreateTreatmentDTO } from "../validators/treatment.validators.js";

const treatmentsController = {
  async getAll(req: Request, res: Response) {
    const response = await treatmentsService.getAll();

    res.status(200).json(response);
  },

  async create(req: Request, res: Response) {
    const result = CreateTreatmentDTO.safeParse(req.body);

    if (!result.success) {
      throw new AppError(400, result.error.issues[0].message);
    }

    const response = await treatmentsService.create(result.data);

    res.status(201).json(response);
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id;

    if (typeof id !== "string" || !id.trim()) {
      throw new AppError(400, `ID is mandatory to send this request.`);
    }

    await treatmentsService.delete(id);

    res.status(204).send();
  },
};

export default treatmentsController;
