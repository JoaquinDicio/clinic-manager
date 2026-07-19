import { Router } from "express";
import whatsappController from "../controllers/whatsapp.controller.js";
const whatsappRouter = Router()

whatsappRouter.post('/', whatsappController.postWhatsapp)

whatsappRouter.post('/bulk', whatsappController.postBulkWhatsapp)

whatsappRouter.get('/contacts', whatsappController.getWhatsappContacts)


export default whatsappRouter