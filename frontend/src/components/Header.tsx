import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/clients": "Clients",
  "/appointments": "Appointments",
  "/templates": "Templates",
  "/schedules": "Schedules",
  "/doctors": "Doctors",
  "/treatments": "Treatments",
};

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      <h1 className="font-semibold text-lg">
        {titles[pathname] ?? "Dashboard"}
      </h1>

      <div className="text-sm text-gray-500">WhatsApp Reminder System</div>
    </header>
  );
}
