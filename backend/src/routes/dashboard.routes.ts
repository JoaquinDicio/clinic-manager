import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller.js";

const dashboardRouter = Router()

dashboardRouter.get('/', dashboardController.getDashboard)

export default dashboardRouter