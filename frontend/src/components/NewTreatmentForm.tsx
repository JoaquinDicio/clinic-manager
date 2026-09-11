import { useState } from "react";

import { FileText, DollarSign, Stethoscope } from "lucide-react";

import { type Treatment, type TreatmentForm } from "../types/treatments";

interface Props {
  addTreatment: (treatment: TreatmentForm) => Promise<Treatment | undefined>;
  error: string | null;
}

const INITIAL_FORM: TreatmentForm = {
  name: "",
  description: "",
  price: 0,
};

export default function NewTreatmentForm({ addTreatment, error }: Props) {
  const [form, setForm] = useState<TreatmentForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, type, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "number" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const newTreatment = await addTreatment(form);

    if (newTreatment) {
      setForm(INITIAL_FORM);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-xl p-2">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Nuevo tratamiento
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Completá los datos para crear un nuevo tratamiento.
        </p>
      </div>

      <div className="space-y-5">
        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Stethoscope className="h-4 w-4 text-gray-400" />
            Nombre
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Limpieza dental"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <FileText className="h-4 w-4 text-gray-400" />
            Descripción
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Descripción del tratamiento..."
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* Precio */}
        <div>
          <label
            htmlFor="price"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <DollarSign className="h-4 w-4 text-gray-400" />
            Precio
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              $
            </span>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="15000"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-8 pr-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
              required
            />
          </div>
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
          disabled={loading}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loading ? "Creando..." : "Crear tratamiento"}
        </button>
      </div>
    </form>
  );
}
