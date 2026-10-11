import { Router } from "express";
import whatsappController from "../controllers/whatsapp.controller.js";
const whatsappRouter = Router()

whatsappRouter.post('/', whatsappController.postWhatsapp)

whatsappRouter.post('/bulk', whatsappController.postBulkWhatsapp)


export default whatsappRouter