import { useEffect, useState } from "react";
import NewTemplateForm from "../components/NewTemplateForm";
import type { Template } from "../types/db";
import { deleteTemplate, getTemplates } from "../services/templates.service";
import ModalContainer from "../components/ModalContainer";

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<boolean>(false);

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

  function handleModal() {
    setModal(!modal);
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <section>
      <button
        onClick={handleModal}
        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded"
      >
        Nuevo Template
      </button>

      {modal && (
        <ModalContainer closeFunction={handleModal}>
          <NewTemplateForm setTemplates={setTemplates} />
        </ModalContainer>
      )}

      <div className="pt-10">
        {templates.length == 0 && <i>There is no templates to show.</i>}

        <ul className="grid gap-2 grid-cols-3">
          {templates.map((template) => (
            <li key={template.id} className="bg-white shadow-sm rounded-sm p-3">
              <div className="flex justify-between items-center">
                <p className="font-bold text-sm">{template.name}</p>
                <button
                  className="bg-red-500 cursor-pointer text-xs hover:bg-red-700 duration-100 p-1 text-white rounded-sm"
                  onClick={() => fetchDelete(template.id)}
                >
                  Eliminar
                </button>
              </div>
              <p>{template.body}</p>
              <i className="text-xs">{template.id}</i>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
