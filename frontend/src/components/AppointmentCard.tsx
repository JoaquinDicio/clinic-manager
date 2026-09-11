import { Clock, UserRound, Stethoscope, Trash2 } from "lucide-react";
import { type AppointmentListItem } from "../types/appointments";

type FormattedAppointment = AppointmentListItem & {
  formattedDate: string;
  formattedTime: string;
  formattedEndTime: string;
};

interface Props {
  appointment: FormattedAppointment;
  onDelete?: (appointmentId: string) => Promise<void>;
}

export default function AppointmentCard({ appointment, onDelete }: Props) {
  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const isToday = appointment.date.toString().slice(0, 10) === todayString;

  async function handleDelete() {
    if (!onDelete) return;

    const confirmed = window.confirm(
      `¿Eliminar el turno de ${appointment.client.name}?`,
    );

    if (!confirmed) return;

    await onDelete(appointment.id);
  }

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md">
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

        <div className="flex items-center gap-2">
          {isToday && (
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
              Hoy
            </span>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Eliminar turno"
              title="Eliminar turno"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
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

      {/* Treatment */}
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5">
        <Stethoscope className="h-4 w-4 text-gray-500" />

        <div>
          {appointment.treatments.length === 0
            ? "Sin tratamientos"
            : appointment.treatments.map((treatment) => (
                <span
                  key={treatment.id}
                  className="text-sm font-medium text-gray-700"
                >
                  {treatment.name}
                </span>
              ))}
        </div>
      </div>
    </div>
  );
}
