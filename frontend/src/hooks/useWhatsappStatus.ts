import { useContext } from "react";
import {
  WhatsappStatusContext,
  type WhatsappStatusContextValue,
} from "../context/WhatsappStatusContext";

export function useWhatsappStatus(): WhatsappStatusContextValue {
  const ctx = useContext(WhatsappStatusContext);

  if (!ctx) {
    throw new Error(
      "useWhatsappStatus debe usarse dentro de WhatsappStatusProvider",
    );
  }

  return ctx;
}
