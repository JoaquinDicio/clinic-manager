const API_URL = "http://localhost:8080/whatsapp";

export interface WhatsappEventHandlers {
  onStatus: (connected: boolean) => void;
  onQr: (qr: string | null) => void;
}

function parsePayload(raw: string): { connected?: boolean; qr?: string | null } {
  try {
    return JSON.parse(raw) as { connected?: boolean; qr?: string | null };
  } catch (err) {
    console.debug("WhatsApp event con payload inválido", err);
    return {};
  }
}

/*
 * Suscripción push (SSE). EventSource reconecta solo ante cortes.
 * Devuelve función para cancelar la suscripción.
 */
export function subscribeWhatsappEvents(
  handlers: WhatsappEventHandlers,
): () => void {
  const source = new EventSource(`${API_URL}/events`);

  source.addEventListener("status", (event) => {
    const data = parsePayload((event as MessageEvent).data);
    if (typeof data.connected === "boolean") handlers.onStatus(data.connected);
  });

  source.addEventListener("qr", (event) => {
    const data = parsePayload((event as MessageEvent).data);
    if ("qr" in data) handlers.onQr(data.qr ?? null);
  });

  source.onerror = () => {
    console.debug("WhatsApp events desconectado, reintentando...");
  };

  return () => source.close();
}
