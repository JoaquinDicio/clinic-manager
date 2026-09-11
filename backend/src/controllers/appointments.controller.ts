import { Request, Response } from "express";
import { AppError } from "../middlewares/errorMiddleware.js";
import appointmentsService from "../services/appointments.service.js";
import { CreateAppointmentSchema } from "../validators/appointment.validator.js";

const appointmentsController = {
  async getAll(req: Request, res: Response) {
    const include = req.query.include;

    if (include === "client") {
      const response = await appointmentsService.getAppointmentsForList();
      res.status(200).json(response);
      return;
    }

    const response = await appointmentsService.get();

    res.status(200).json(response);
  },

  async create(req: Request, res: Response) {
    const result = CreateAppointmentSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(400, result.error.issues[0].message);
    }

    const response = await appointmentsService.create({ ...result.data });

    res.status(201).json(response);
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id;

    if (typeof id !== "string" || !id.trim()) {
      throw new AppError(400, `ID is mandatory to send this request.`);
    }

    await appointmentsService.delete(id);

    res.status(204).send();
  },
};

export default appointmentsController;
