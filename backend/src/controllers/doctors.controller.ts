import { Request, Response } from "express";
import doctorsService from "../services/doctors.service.js";
import { AppError } from "../middlewares/errorMiddleware.js";
import { CreateDoctorSchema } from "../validators/doctor.validator.js";

const doctorsController = {
  async getAll(req: Request, res: Response) {
    const response = await doctorsService.getAll();
    res.status(200).json(response);
  },

  async create(req: Request, res: Response) {
    const result = CreateDoctorSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(400, result.error.issues[0].message);
    }

    const response = await doctorsService.create(req.body);

    res.status(201).json(response);
  },

  async delete() {},
};

export default doctorsController;
