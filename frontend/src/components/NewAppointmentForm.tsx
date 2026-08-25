import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Bell,
  UserRound,
  Stethoscope,
  FileText,
} from "lucide-react";
import { type AppointmentWithClient } from "../types/appointments";
import { type AppointmentForm } from "../types/appointments";
import useTemplates from "../hooks/useTemplates";
import useDoctors from "../hooks/useDoctors.tsx";
import ClientAutocomplete from "./ClientAutocomplete";

const INITIAL_FORM: AppointmentForm = {
  clientId: "",
  date: "",
  time: "",
  reminder: false,
  doctorId: "",
  note: "",
  slots: 1,
};

interface Props {
  addAppointment: (
    appointment: AppointmentForm,
  ) => Promise<AppointmentWithClient | undefined>;
  error: string | null;
}

export default function NewAppointmentForm({ addAppointment, error }: Props) {
  const { templates, error: templatesError } = useTemplates();
  const { doctors, error: doctorsError } = useDoctors();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, type, value, checked } = e.target as HTMLInputElement;

    setForm((prevForm) => ({
      ...prevForm,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const newAppointment = await addAppointment(form);

    if (newAppointment) {
      setForm(INITIAL_FORM);
    }

    setLoading(false);
  }

  function selectClient(clientId: string) {
    setForm((prev) => ({
      ...prev,
      clientId,
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl rounded-xl p-2 max-h-125 overflow-y-scroll"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Nuevo turno</h2>

        <p className="mt-1 text-sm text-gray-500">
          Completá los datos para agendar un nuevo turno.
        </p>
      </div>

      <div className="space-y-5">
        {/* Cliente */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <UserRound className="h-4 w-4 text-gray-400" />
            Cliente
          </label>

          <ClientAutocomplete onChange={selectClient} />
        </div>

        {/* Doctor */}
        <div>
          <label
            htmlFor="templateId"
            className="mb-2 text-sm font-medium text-gray-700 flex gap-3"
          >
            <Stethoscope className="h-4 w-4 text-gray-400" />
            Doctor
          </label>

          <select
            id="doctorId"
            name="doctorId"
            value={form.doctorId || ""}
            onChange={handleSelectChange}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
            required
          >
            <option value="">Seleccioná un doctor</option>

            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>

          {templatesError && (
            <p className="mt-2 text-xs text-red-500">{doctorsError}</p>
          )}
        </div>

        {/* Fecha y hora */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="date"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <CalendarDays className="h-4 w-4 text-gray-400" />
              Fecha
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="time"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Clock3 className="h-4 w-4 text-gray-400" />
              Hora
            </label>

            <input
              id="time"
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
              required
            />
          </div>
        </div>

        {/* Duración */}
        <div>
          <label
            htmlFor="slots"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Duración
          </label>

          <div className="flex items-center gap-3">
            <input
              id="slots"
              name="slots"
              type="number"
              min="1"
              value={form.slots}
              onChange={handleChange}
              className="w-24 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
              required
            />

            <span className="text-sm text-gray-500">
              bloque(s) de 30 minutos
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="note"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <FileText className="h-4 w-4 text-gray-400" />
            Detalle del turno
          </label>

          <textarea
            id="note"
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={3}
            placeholder="Ej. Limpieza dental, extracción, control..."
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* Recordatorio */}
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <label className="flex cursor-pointer items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <Bell className="h-4 w-4 text-gray-500" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Enviar recordatorio
                </p>

                <p className="text-xs text-gray-500">
                  Enviar un mensaje antes del turno
                </p>
              </div>
            </div>

            <input
              id="reminder"
              name="reminder"
              type="checkbox"
              checked={form.reminder}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-gray-900 focus:ring-gray-200"
            />
          </label>
        </div>

        {/* Template */}
        {form.reminder && (
          <div>
            <label
              htmlFor="templateId"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Template del recordatorio
            </label>

            <select
              id="templateId"
              name="templateId"
              value={form.templateId || ""}
              onChange={handleSelectChange}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
              required
            >
              <option value="">Seleccioná un template</option>

              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>

            {templatesError && (
              <p className="mt-2 text-xs text-red-500">{templatesError}</p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loading ? "Agendando..." : "Agendar turno"}
        </button>
      </div>
    </form>
  );
}
