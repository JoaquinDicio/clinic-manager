import { useState, useEffect } from "react";
import type { Client } from "../types/db";
import NewClientForm from "../components/NewClientForm";
import { getClients, deleteClient } from "../services/clients.service";
import ModalContainer from "../components/ModalContainer";
import Table from "../components/Table.tsx";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const response = await getClients();
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError("Error fetching clients");
      console.error("Error:", err);
    }
  }

  async function fetchDelete(clientId: string) {
    try {
      const response = await deleteClient(clientId);
      if (response.ok) {
        setClients((prevClients) =>
          prevClients.filter((client) => client.id !== clientId),
        );
      }
    } catch (err) {
      setError("Error deleting client");
      console.error("Error:", err);
    }
  }

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
          <NewClientForm setClients={setClients} />
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
              { header: "Phone", accessor: (row) => row.name },
            ]}
            onDelete={(id) => fetchDelete(id)}
          />
        )}
      </div>
    </div>
  );
}
