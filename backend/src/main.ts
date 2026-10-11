import express from "express";
import whatsappRouter from "./routes/whatsapp.routes.js";
import whatsappPublicRouter from "./routes/whatsappPublic.routes.js";
import clientsRouter from "./routes/clients.routes.js";
import { checkWhatsappReady } from "./middlewares/checkWhatsappReady.js";
import { connectToWhatsapp } from "./config/whatsapp.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import templatesRouter from "./routes/templates.routes.js";
import { startDispatcher } from "./jobs/dispatcher.js";
import appointmentsRouter from "./routes/appointments.routes.js";
import schedulesRouter from "./routes/schedules.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import doctorsRouter from "./routes/doctors.routes.js";
import treatmentsRouter from "./routes/treatments.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

const PORT = process.env.PORT || 8080;

async function main() {
  // Públicas (sin checkWhatsappReady): estado y QR para el frontend.
  app.use("/whatsapp", whatsappPublicRouter);

  app.use("/wpp", checkWhatsappReady, whatsappRouter);

  app.use("/clients", clientsRouter);
  app.use("/templates", templatesRouter);
  app.use("/schedules", schedulesRouter);
  app.use("/appointments", appointmentsRouter);
  app.use("/dashboard", dashboardRouter);
  app.use("/doctors", doctorsRouter);
  app.use("/treatments", treatmentsRouter);

  startDispatcher();

  app.use(errorMiddleware);

  app.listen(PORT, () => {
    console.log("App is launched at:", PORT);
  });

  // No bloquea el boot: el QR queda disponible en /whatsapp/qr
  // mientras se espera el escaneo.
  connectToWhatsapp().catch((err) => {
    console.error("WhatsApp connection failed:", err);
  });
}
main();
