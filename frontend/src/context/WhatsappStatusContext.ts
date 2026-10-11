import { createContext } from "react";

export interface WhatsappStatusContextValue {
  /** null = aún sin primer evento */
  connected: boolean | null;
  /** QR vigente en data URL, null si no hay pendiente */
  qr: string | null;
}

export const WhatsappStatusContext =
  createContext<WhatsappStatusContextValue | null>(null);
