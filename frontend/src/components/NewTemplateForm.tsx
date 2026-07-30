import { useState } from "react";
import { type Template } from "../types/db";
import { extractVariables } from "../utils/templates";
import { type TemplateForm } from "../types/templates";
import { postTemplate } from "../services/templates.service";

const INITIAL_FORM: TemplateForm = {
    name: "",
    body: ""
};

export default function NewTemplateForm({ setTemplates }: { setTemplates: React.Dispatch<React.SetStateAction<Template[]>>; }) {

    const [error, setError] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<TemplateForm>(INITIAL_FORM);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prevForm => ({
            ...prevForm,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const formData = {
                ...form,
                variables: extractVariables(form.body)
            };

            const response = await postTemplate(formData);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error creating template");
            }

            const newTemplate: Template = await response.json();

            setForm(INITIAL_FORM);

            setTemplates(prevTemplates => [
                ...prevTemplates,
                newTemplate
            ]);

        } catch (error: unknown) {
            console.error(error);

            if (error instanceof Error) {

                setError(error.message);

            } else {

                setError("Error creating template");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 flex flex-col"
        >
            <div>
                <label htmlFor="name">
                    Name
                </label>

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
                <label htmlFor="body">
                    Message
                </label>

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

            {error && (
                <i className="text-red-500 text-sm">
                    {error}
                </i>
            )}

            <button
                type="submit"
                className="bg-blue-600 disabled:bg-gray-500 max-w-fit cursor-pointer hover:bg-blue-700 duration-100 text-white px-5 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Creando..." : "Crear Template"}
            </button>
        </form>
    );
}