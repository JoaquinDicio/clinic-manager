import { useEffect, useState } from "react";
import {
  getTemplates,
  deleteTemplate,
  postTemplate,
} from "../services/templates.service";
import { type Template } from "../types/db";
import { type TemplateForm } from "../types/templates";

export default function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

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

  async function fetchDelete(templateId: string) {
    try {
      const response = await deleteTemplate(templateId);

      if (response.ok) {
        setTemplates((prevTemplates) =>
          prevTemplates.filter((template) => template.id !== templateId),
        );
      }
    } catch (err) {
      setError("Error deleting template");
      console.error("Error:", err);
    }
  }

  async function addTemplate(template: TemplateForm) {
    setError(null); // reset error every time we add a new template

    try {
      const response = await postTemplate(template);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error creating template");
      }

      setTemplates((prevTemplates) => [...prevTemplates, data]);

      return data;
    } catch (err) {
      if (err instanceof Error) {
        setActionError(err.message);
      } else {
        setActionError("Error creating template");
      }
    }
  }
  return { templates, error, fetchDelete, addTemplate, actionError };
}
