import { useEffect, useState } from "react";
import NewTemplateForm from "../components/NewTemplateForm";
import type { Template } from "../types/db";
import { deleteTemplate, getTemplates } from "../services/templates.service";
import ModalContainer from "../components/ModalContainer";
import Table from "../components/Table";

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
        {templates.length == 0 ? (
          <i>There is no templates to show.</i>
        ) : (
          <Table
            data={templates}
            cols={[
              { header: "ID", accessor: "id" },
              { header: "Name", accessor: "name" },
              { header: "Body", accessor: "body" },
            ]}
            onDelete={(id) => fetchDelete(id)}
          />
        )}
      </div>
    </section>
  );
}
