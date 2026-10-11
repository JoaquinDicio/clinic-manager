import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  type WASocket,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import QRCode from "qrcode";
import type { Response } from "express";

export let isWhatsappConnected = false;

let lastQr: string | null = null;
let sock: WASocket | null = null;
let initialized = false;

export function getLastQr(): string | null {
  return lastQr;
}

export function getSocket(): WASocket | null {
  return sock;
}

/* --- SSE: push de estado/QR al frontend (sin polling) --- */

const eventClients = new Set<Response>();

function sendEvent(res: Response, event: string, data: unknown) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

async function emitQrDataUrl(): Promise<string | null> {
  const qr = getLastQr();
  return qr ? QRCode.toDataURL(qr) : null;
}

function broadcastStatus() {
  for (const res of eventClients) {
    sendEvent(res, "status", { connected: isWhatsappConnected });
  }
}

async function broadcastQr() {
  const qr = await emitQrDataUrl();
  for (const res of eventClients) {
    sendEvent(res, "qr", { qr });
  }
}

export function subscribeWhatsappEvents(res: Response) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  eventClients.add(res);

  // Snapshot inicial para no esperar al próximo cambio.
  sendEvent(res, "status", { connected: isWhatsappConnected });
  emitQrDataUrl().then((qr) => sendEvent(res, "qr", { qr }));

  res.on("close", () => {
    eventClients.delete(res);
  });
}

function startSocket(onOpen: () => void, onLoggedOut: (err: Error) => void) {
  useMultiFileAuthState("./baileys_auth").then(({ state, saveCreds }) => {
    sock = makeWASocket({ auth: state });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log("Scan QR:");
        qrcode.generate(qr, { small: true });
        lastQr = qr;
        void broadcastQr();
      }

      if (connection === "open") {
        console.log("WhatsApp is connected!");
        isWhatsappConnected = true;
        lastQr = null;
        broadcastStatus();
        void broadcastQr();
        onOpen();
      }

      if (connection === "close") {
        isWhatsappConnected = false;
        lastQr = null;
        broadcastStatus();
        void broadcastQr();

        const statusCode = (lastDisconnect?.error as Boom)?.output
          ?.statusCode;
        const loggedOut = statusCode === DisconnectReason.loggedOut;

        console.log(
          "WhatsApp disconnected. Logged out:",
          loggedOut,
          "Reconnecting:",
          !loggedOut,
        );

        if (loggedOut) {
          sock = null;
          initialized = false;
          onLoggedOut(new Error("Sesión cerrada desde el teléfono"));
        } else {
          // Reconexión automática (caídas de red, reinicios de WA, etc.)
          startSocket(onOpen, onLoggedOut);
        }
      }
    });
  });
}

export async function connectToWhatsapp(): Promise<void> {
  if (initialized) return;
  initialized = true;

  return new Promise((resolve, reject) => {
    startSocket(
      () => resolve(),
      (err) => reject(err),
    );
  });
}
