import { useEffect, useState } from "react";
import { getTemplates } from "../services/templates.service";
import { type Template } from "../types/db";

export default function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return { templates, error };
}
