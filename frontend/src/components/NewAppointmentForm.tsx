import { type AppointmentForm } from "../types/appointments";
import { useState, useEffect } from "react";
import { postAppointment } from "../services/appointments.service";
import { type AppointmentsWithClient } from "../types/appointments";
import { type Template } from "../types/db";
import { getTemplates } from "../services/templates.service";

const INITIAL_FORM: AppointmentForm = {
  clientId: "",
  date: "",
  time: "",
  reminder: false,
  slots: 1,
};

export default function NewAppointmentForm({
  setAppointments,
}: {
  setAppointments: React.Dispatch<
    React.SetStateAction<AppointmentsWithClient[]>
  >;
}) {
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AppointmentForm>(INITIAL_FORM);
  const [templates, setTemplates] = useState<Template[]>([]);

  async function fetchTemplates() {
    try {
      const response = await getTemplates();
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      console.error("Error:", err);
    }
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = e.target;

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

    try {
      const response = await postAppointment(form);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating appointment");
      }

      const newAppointment = await response.json();
      setAppointments((prevAppointments) => [
        ...prevAppointments,
        {
          ...newAppointment,
          formatted_date: new Date(newAppointment.date).toLocaleDateString(),
        },
      ]);

      setForm(INITIAL_FORM);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error creating template");
      }
    }
  }

  return (
    <div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-4 max-w-48"
        action="/appointments"
        method="POST"
      >
        <label htmlFor="clientId">Client ID</label>
        <input
          id="clientId"
          name="clientId"
          value={form.clientId}
          onChange={handleChange}
          placeholder="Client ID"
          className="rounded p-2 w-full bg-white shadow-sm"
          required
        />
        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          value={form.date}
          type="date"
          onChange={handleChange}
          placeholder="dd-mm-yyyy"
          className="rounded p-2 w-full bg-white shadow-sm"
          required
        />
        <label htmlFor="time">Time</label>
        <input
          id="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          placeholder="hh:mm"
          className="rounded p-2 w-full bg-white shadow-sm"
          required
        />
        <label htmlFor="reminder">Reminder</label>
        <input
          id="reminder"
          name="reminder"
          type="checkbox"
          checked={form.reminder}
          onChange={handleChange}
          className="rounded bg-white shadow-sm"
        />
        {form.reminder && (
          <>
            <label htmlFor="templateId">Template</label>

            <select
              id="templateId"
              name="templateId"
              value={form.templateId || ""}
              onChange={handleSelectChange}
              className="rounded p-2 w-full bg-white shadow-sm"
              required
            >
              <option value="">Seleccioná un template</option>

              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </>
        )}
        <label htmlFor="slots">Slots</label>
        <input
          id="slots"
          name="slots"
          value={form.slots}
          onChange={handleChange}
          placeholder="1"
          className="rounded p-2 w-full bg-white shadow-sm"
          required
        />
        <i className="text-xs text-red-500">{error}</i>
        <button
          type="submit"
          className="bg-blue-600 disabled:bg-gray-500 max-w-fit cursor-pointer hover:bg-blue-700 duration-100 text-white px-5 py-2 rounded"
        >
          Agendar
        </button>
      </form>
    </div>
  );
}
