import { useState } from "react";

interface TemplateForm {
    name: string;
    body: string;
    variables: string[];
}

export default function NewTemplateForm() {

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

            const response = await fetch(
                "http://localhost:8080/templates",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ ...form, variables: extractVariables(form.body) })
                }
            );

            console.log(response);


            if (!response.ok) {
                throw new Error("Failed creating template");
            }

            alert("Template created");

            setForm({
                name: "",
                body: "",
                variables: []
            });

        } catch (error) {
            console.error(error);
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
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
                    className="border rounded p-2 w-full"
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
                    className="border rounded p-2 w-full"
                />
            </div>

            <button
                className="bg-blue-600 text-white px-5 py-2 rounded"
            >
                Create Template
            </button>


        </form>
    );
}