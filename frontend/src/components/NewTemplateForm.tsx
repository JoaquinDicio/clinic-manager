import { useState } from "react";
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
    <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
      <div>
        <label htmlFor="name">Name</label>

        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Appointment reminder"
          className="rounded p-2 w-full bg-white shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="body">Message</label>

        <textarea
          id="body"
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Hola {{name}}, recordamos tu turno para {{date}}"
          rows={6}
          className="rounded p-2 w-full bg-white shadow-sm"
          required
        />
      </div>

      {error && <i className="text-red-500 text-sm">{error}</i>}

      <button
        type="submit"
        className="bg-blue-600 disabled:bg-gray-500 max-w-fit cursor-pointer hover:bg-blue-700 duration-100 text-white px-5 py-2 rounded"
        disabled={posting}
      >
        {posting ? "Creando..." : "Crear Template"}
      </button>
    </form>
  );
}
