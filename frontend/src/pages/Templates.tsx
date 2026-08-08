import { useState } from "react";
import NewTemplateForm from "../components/NewTemplateForm";
import ModalContainer from "../components/ModalContainer";
import Table from "../components/Table";
import useTemplates from "../hooks/useTemplates";

export default function Templates() {
  const { templates, error, fetchDelete, addTemplate, actionError } =
    useTemplates();
  const [modal, setModal] = useState<boolean>(false);

  function handleModal() {
    setModal(!modal);
  }

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
          <NewTemplateForm error={actionError} addTemplate={addTemplate} />
        </ModalContainer>
      )}

      <div className="pt-10">
        {templates.length == 0 ? (
          <i>There is no templates to show.</i>
        ) : (
          <Table
            data={templates}
            cols={[
              { header: "ID", accessor: (row) => row.id },
              { header: "Name", accessor: (row) => row.name },
              { header: "Body", accessor: (row) => row.body },
            ]}
            onDelete={(id) => fetchDelete(id)}
          />
        )}
      </div>
    </section>
  );
}
