import {
  getSocket,
  isWhatsappConnected,
  getLastQr,
  subscribeWhatsappEvents,
} from "../config/whatsapp.js";
import { Message, SendResult } from "../types/whatsapp.types.js";
import QRCode from "qrcode";
import type { Response } from "express";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms)); // we use this to avoid being blocked or banned

const whatsappService = {
  async sendWhatsapp(
    phone: string,
    message: string,
    scheduleId?: string,
  ): Promise<SendResult> {
    const sock = getSocket();

    if (!sock || !isWhatsappConnected) {
      throw new Error("WhatsApp no está conectado");
    }

    const result = await sock.onWhatsApp(phone);
    const resolved = result?.[0];

    if (!resolved?.exists) {
      throw new Error("No se pudo resolver el número");
    }

    try {
      await sock.sendMessage(resolved.jid, { text: message });

      return {
        phone,
        scheduleId,
        status: "sent",
      };
    } catch (error) {
      console.log("Error sending whatsapp message", error);
      return {
        phone,
        scheduleId,
        status: "failed",
        error,
      };
    }
  },

  async sendBulkWhatsapp(messages: Message[]): Promise<SendResult[]> {
    const results: SendResult[] = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];

      const result = await this.sendWhatsapp(
        msg.phone,
        msg.message,
        msg.scheduleId,
      );

      results.push(result);

      const isLast = i === messages.length - 1;

      if (!isLast) {
        await delay(500);
      }
    }

    return results;
  },

  async getStatus(): Promise<{ connected: boolean }> {
    return { connected: isWhatsappConnected };
  },

  async getQrDataUrl(): Promise<string | null> {
    const qr = getLastQr();

    if (!qr) return null;

    return QRCode.toDataURL(qr);
  },

  streamEvents(res: Response): void {
    subscribeWhatsappEvents(res);
  },
};

export default whatsappService;
