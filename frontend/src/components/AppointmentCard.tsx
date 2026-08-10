import { type AppointmentDashboard } from "../types/dashboard";
import { Clock, UserRound, Stethoscope } from "lucide-react";

export default function AppointmentCard({
  appointment,
}: {
  appointment: AppointmentDashboard;
}) {
  return (
    <div
      key={appointment.id}
      className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
            {appointment.formattedDate}
          </p>

          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />

            <span className="text-lg font-semibold text-gray-900">
              {appointment.formattedTime}
            </span>

            <span className="text-sm text-gray-400">
              — {appointment.formattedEndTime}
            </span>
          </div>
        </div>

        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
          Hoy
        </span>
      </div>
      {/* Divider */}
      <div className="my-4 border-t border-gray-100" />
      {/* Client */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <UserRound className="h-5 w-5 text-gray-500" />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            {appointment.client.name}
          </p>

          <p className="text-xs text-gray-500">{appointment.client.phone}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5">
        <Stethoscope className="h-4 w-4 text-gray-500" />

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Tratamiento
          </p>

          <p className="text-sm font-medium text-gray-700">Limpieza facial</p>
        </div>
      </div>
    </div>
  );
}
