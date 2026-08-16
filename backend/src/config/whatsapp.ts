import whatsapp from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new whatsapp.Client({
  authStrategy: new whatsapp.LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

export let isWhatsappConnected = false;

let initialized = false;

export async function connectToWhatsapp(): Promise<void> {
  if (initialized) return;
  initialized = true;

  return new Promise((resolve, reject) => {
    client.on("qr", (qr) => {
      console.log("Scan QR:");
      qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
      console.log("WhatsApp is connected!");
      isWhatsappConnected = true;
      resolve();
    });

    client.on("auth_failure", (msg) => {
      console.error("Authentication error:", msg);
      reject(new Error(msg));
    });

    client.on("disconnected", (reason) => {
      console.log("WhatsApp disconnected:", reason);
      isWhatsappConnected = false;
      initialized = false;
    });

    client.initialize().catch((error) => {
      console.error("WhatsApp initialization failed:", error);
    });
  });
}

export default client;
