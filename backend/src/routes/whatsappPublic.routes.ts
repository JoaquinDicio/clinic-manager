import { Router } from "express";
import whatsappController from "../controllers/whatsapp.controller.js";

/*
 * Rutas públicas de WhatsApp: NO pasan por checkWhatsappReady,
 * porque se usan justamente cuando todavía no hay conexión.
 */
const whatsappPublicRouter = Router();

whatsappPublicRouter.get("/status", whatsappController.getStatus);

whatsappPublicRouter.get("/qr", whatsappController.getQr);

whatsappPublicRouter.get("/events", whatsappController.getEvents);

export default whatsappPublicRouter;
