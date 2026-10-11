import { Link, useLocation } from "react-router-dom";
import { useWhatsappStatus } from "../hooks/useWhatsappStatus";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/clients": "Clients",
  "/appointments": "Appointments",
  "/templates": "Templates",
  "/schedules": "Schedules",
  "/doctors": "Doctors",
  "/treatments": "Treatments",
  "/whatsapp": "WhatsApp",
};

export default function Header() {
  const { pathname } = useLocation();
  const { connected } = useWhatsappStatus();

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      <h1 className="font-semibold text-lg">
        {titles[pathname] ?? "Dashboard"}
      </h1>

      <Link
        to="/whatsapp"
        title="Ver estado de WhatsApp"
        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border ${
          connected
            ? "text-green-700 border-green-200 bg-green-50"
            : "text-red-700 border-red-200 bg-red-50"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        {connected === null
          ? "WhatsApp..."
          : connected
            ? "WhatsApp conectado"
            : "WhatsApp desconectado"}
      </Link>
    </header>
  );
}
