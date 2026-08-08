import NewClientForm from "../components/NewClientForm";
import ModalContainer from "../components/ModalContainer";
import Table from "../components/Table.tsx";
import useClients from "../hooks/useClients.tsx";
import { useState } from "react";

export default function Clients() {
  const [modal, setModal] = useState<boolean>(false);
  const { clients, error, fetchDelete, addClient, actionError } = useClients();

  function handleModal() {
    setModal(!modal);
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      {modal && (
        <ModalContainer closeFunction={handleModal}>
          <NewClientForm addClient={addClient} error={actionError} />
        </ModalContainer>
      )}

      <button
        onClick={handleModal}
        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded"
      >
        Nuevo Cliente
      </button>

      <div className="pt-10">
        {clients.length == 0 ? (
          <i>There is no clients to show.</i>
        ) : (
          <Table
            data={clients}
            cols={[
              { header: "ID", accessor: (row) => row.id },
              { header: "Name", accessor: (row) => row.name },
              { header: "Phone", accessor: (row) => row.phone },
            ]}
            onDelete={(id) => fetchDelete(id)}
          />
        )}
      </div>
    </div>
  );
}
