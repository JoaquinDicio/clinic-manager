import { Request, Response } from "express";
import schedulesService from "../services/schedules.service.js";
import { CreateScheduleDTO } from "../validators/schedule.validator.js";
import { AppError } from "../middlewares/errorMiddleware.js";

const schedulesController = {
  async getAll(req: Request, res: Response) {
    const status = req.query.status;

    if (status == "pending") {
      const pendingSchedules = await schedulesService.getPending();
      res.status(200).json(pendingSchedules);
      return;
    }

    const schedules = await schedulesService.getAll();
    res.status(200).json(schedules);
  },

  async create(req: Request, res: Response) {
    const { templateId, sendAt, clientId, body }: CreateScheduleDTO = req.body;

    if (!templateId?.trim() || !sendAt?.trim() || !clientId?.trim() || !body?.trim()) {
      throw new AppError(
        400,
        "templateId, sendAt, clientId and body are required fields",
      );
    }

    const response = await schedulesService.create({
      templateId,
      sendAt,
      clientId,
      body,
    });

    res.status(201).json(response);
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      throw new AppError(400, "Schedule id is required");
    }

    await schedulesService.delete(id);

    return res.status(204).send();
  },
};

export default schedulesController;
