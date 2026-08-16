import { useState } from "react";
import { Mail, Phone, Stethoscope, UserRound } from "lucide-react";
import { type DoctorDTO } from "../types/doctor.js";
import { type Doctor } from "../types/db";

interface Props {
  addDoctor: (doctor: DoctorDTO) => Promise<Doctor>;
  error: string | null;
}

interface DoctorForm {
  name: string;
  phone: string;
  email: string;
  specialty: string;
}

const INITIAL_FORM: DoctorForm = {
  name: "",
  phone: "",
  email: "",
  specialty: "",
};

export default function NewDoctorForm({ addDoctor, error }: Props) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [posting, setPosting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setPosting(true);

    const newDoctor = await addDoctor(form);

    if (newDoctor) {
      setForm(INITIAL_FORM);
    }

    setPosting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-xl p-2">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Nuevo doctor</h2>

        <p className="mt-1 text-sm text-gray-500">
          Completá los datos para registrar un nuevo doctor.
        </p>
      </div>

      <div className="space-y-5">
        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <UserRound className="h-4 w-4 text-gray-400" />
            Nombre
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
            placeholder="Nombre completo"
            required
          />
        </div>

        {/* Teléfono */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Phone className="h-4 w-4 text-gray-400" />
            Teléfono
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
            placeholder="Número de teléfono"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Mail className="h-4 w-4 text-gray-400" />
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
            placeholder="correo@ejemplo.com"
          />
        </div>

        {/* Especialidad */}
        <div>
          <label
            htmlFor="specialty"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Stethoscope className="h-4 w-4 text-gray-400" />
            Especialidad
          </label>

          <input
            id="specialty"
            name="specialty"
            type="text"
            value={form.specialty}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
            placeholder="Ej. Odontología"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={posting}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {posting ? "Guardando..." : "Crear doctor"}
        </button>
      </div>
    </form>
  );
}
