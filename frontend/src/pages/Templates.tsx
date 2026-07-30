import { useEffect, useState } from "react";
import NewTemplateForm from "../components/NewTemplateForm";
import type { Template } from "../types/db";
import { getTemplates } from "../services/templates.service";

export default function Templates() {
    const [templates, setTemplates] = useState<Template[]>([])
    const [error, setError] = useState<string | null>(null)

    async function fetchTemplates() {
        try {
            const response = await getTemplates();
            const data = await response.json();
            setTemplates(data);
        } catch (err) {
            setError("Error fetching templates");
            console.error("Error:", err);
        }
    }

    useEffect(() => {
        fetchTemplates();
    }, []);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return <section>
        <div>
            <NewTemplateForm setTemplates={setTemplates} />
        </div>
        <div>
            <ul className="pt-10 grid gap-2 grid-cols-3">
                {templates.map((template) => (
                    <li key={template.id} className="bg-white shadow-sm rounded-sm p-3">
                        <p className="font-bold text-sm">{template.name}</p>
                        <p>{template.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    </section>
}