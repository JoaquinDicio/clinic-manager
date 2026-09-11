import { useState } from "react";
import NewTreatmentForm from "../components/NewTreatmentForm.tsx";
import ModalContainer from "../components/ModalContainer";
import Table from "../components/Table";
import useTreatments from "../hooks/useTreatments.tsx";

export default function Treatments() {
  const { treatments, error, deactivateTreatment, addTreatment, actionError } =
    useTreatments();

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
        Nuevo Tratamiento
      </button>

      {modal && (
        <ModalContainer closeFunction={handleModal}>
          <NewTreatmentForm error={actionError} addTreatment={addTreatment} />
        </ModalContainer>
      )}

      <div className="pt-10">
        {treatments.length == 0 ? (
          <i>There are no treatments to show.</i>
        ) : (
          <Table
            data={treatments}
            cols={[
              { header: "ID", accessor: (row) => row.id },
              { header: "Name", accessor: (row) => row.name },
              {
                header: "Description",
                accessor: (row) => row.description,
              },
              { header: "Price", accessor: (row) => row.price },
              { header: "Active", accessor: (row) => row.active },
            ]}
            onDelete={(id) => deactivateTreatment(id)}
          />
        )}
      </div>
    </section>
  );
}
