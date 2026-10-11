import { useState, useEffect, type ReactNode } from "react";
import { subscribeWhatsappEvents } from "../services/whatsapp.service";
import { WhatsappStatusContext } from "../context/WhatsappStatusContext";

export function WhatsappStatusProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeWhatsappEvents({
      onStatus: setConnected,
      onQr: setQr,
    });
    return unsubscribe;
  }, []);

  return (
    <WhatsappStatusContext.Provider value={{ connected, qr }}>
      {children}
    </WhatsappStatusContext.Provider>
  );
}
