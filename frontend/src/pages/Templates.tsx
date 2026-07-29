import { useEffect, useState } from "react";
import NewTemplateForm from "../components/NewTemplateForm";
import type { Template } from "../types/db";

export default function Templates() {
    const [templates, setTemplates] = useState<Template[]>([])

    async function getTemplates() {
        const response = await fetch("http://localhost:8080/templates");
        const data = await response.json();
        setTemplates(data);
    }

    useEffect(() => {
        getTemplates();
        console.log(templates)
    }, []);

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