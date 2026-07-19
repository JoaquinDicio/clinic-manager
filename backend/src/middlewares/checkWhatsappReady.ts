import { Request, Response, NextFunction } from "express";
import { isWhatsappConnected } from "../config/whatsapp.js";

export function checkWhatsappReady(
    req: Request,
    res: Response,
    next: NextFunction
) {

    if (!isWhatsappConnected) {
        return res.status(503).json({
            error: "WhatsApp aún no está conectado, intenta de nuevo en unos segundos."
        });
    }

    next();
}