import { useState } from "react";
import { type Template } from "../types/db";

interface TemplateForm {
    name: string;
    body: string;
    variables: string[];
}

export default function NewTemplateForm({ setTemplates }: { setTemplates: React.Dispatch<React.SetStateAction<Template[]>> }) {

    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<TemplateForm>({
        name: "",
        body: "",
        variables: []
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    function extractVariables(text: string): string[] {

        const matches = text.match(
            /{{(.*?)}}/g
        );

        if (!matches)
            return [];


        return [
            ...new Set(
                matches.map(variable =>
                    variable
                        .replace("{{", "")
                        .replace("}}", "")
                        .trim()
                )
            )
        ];
    }


    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            const formData = {
                ...form,
                variables: extractVariables(form.body)
            };

            const response = await fetch(
                "http://localhost:8080/templates",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error creating template");
            }

            const newTemplate: Template = await response.json();

            setError("");

            setForm({
                name: "",
                body: "",
                variables: []
            });

            setTemplates(prevTemplates => [
                ...prevTemplates,
                newTemplate
            ]);

        } catch (error: Error | any) {
            console.error(error)
            setError(error.message || "Error creating template");
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 flex flex-col"
        >

            <div>
                <label>
                    Name
                </label>

                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Appointment reminder"
                    className="rounded p-2 w-full bg-white shadow-sm"
                />
            </div>


            <div>
                <label>
                    Message
                </label>

                <textarea
                    name="body"
                    value={form.body}
                    onChange={handleChange}
                    placeholder={
                        "Hola {{name}}, recordamos tu turno para {{date}}"
                    }
                    rows={6}
                    className="rounded p-2 w-full bg-white shadow-sm"
                />
            </div>
            <i className="text-red-500 text-sm">{error}</i>
            <button
                className="bg-blue-600 max-w-fit cursor-pointer hover:bg-blue-700 duration-100 text-white px-5 py-2 rounded"
            >
                Create Template
            </button>


        </form>
    );
}