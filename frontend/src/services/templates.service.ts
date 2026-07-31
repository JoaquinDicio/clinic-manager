import { type TemplateForm } from "../types/templates";

export async function postTemplate(formData: TemplateForm): Promise<Response> {
    return await fetch(
        "http://localhost:8080/templates",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        }
    );
}

export async function getTemplates(): Promise<Response> {
    return await fetch(
        "http://localhost:8080/templates",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}

export async function deleteTemplate(templateId: string): Promise<Response> {
    return await fetch(
        `http://localhost:8080/templates/${templateId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}