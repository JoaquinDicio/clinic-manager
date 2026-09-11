import { useState } from "react";
import { FileText, MessageSquare } from "lucide-react";

import { extractVariables } from "../utils/templates";
import { type TemplateForm } from "../types/templates";

interface Props {
  addTemplate: (template: TemplateForm) => Promise<TemplateForm>;
  error: string | null;
}

const INITIAL_FORM: TemplateForm = {
  name: "",
  body: "",
};

export default function NewTemplateForm({ addTemplate, error }: Props) {
  const [posting, setPosting] = useState(false);
  const [form, setForm] = useState<TemplateForm>(INITIAL_FORM);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);

    const formData = {
      ...form,
      variables: extractVariables(form.body),
    };

    const template = await addTemplate(formData);

    if (template) {
      setForm(INITIAL_FORM);
    }

    setPosting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-xl p-2">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Nuevo template</h2>

        <p className="mt-1 text-sm text-gray-500">
          Creá un mensaje que puedas reutilizar para tus comunicaciones.
        </p>
      </div>

      <div className="space-y-5">
        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <FileText className="h-4 w-4 text-gray-400" />
            Nombre
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Recordatorio de turno"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
            required
          />
        </div>

        {/* Mensaje */}
        <div>
          <label
            htmlFor="body"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <MessageSquare className="h-4 w-4 text-gray-400" />
            Mensaje
          </label>

          <textarea
            id="body"
            name="body"
            value={form.body}
            onChange={handleChange}
            placeholder="Hola {{name}}, recordamos tu turno para {{date}}."
            rows={6}
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
            required
          />

          <p className="mt-2 text-xs text-gray-400">
            Podés usar variables como{" "}
            <span className="font-medium text-gray-500">{"{{name}}"}</span>,{" "}
            <span className="font-medium text-gray-500">{"{{date}}"}</span> o{" "}
            <span className="font-medium text-gray-500">{"{{time}}"}</span>.
          </p>
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
          {posting ? "Creando..." : "Crear template"}
        </button>
      </div>
    </form>
  );
}
