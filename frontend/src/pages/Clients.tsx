import { useState, useEffect } from "react";
import type { Client } from "../types/db";
import NewClientForm from "../components/NewClientForm";
import { getClients, deleteClient } from "../services/clients.service";
import ModalContainer from "../components/ModalContainer";

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
        {clients.length == 0 && <i>There is no clients to show.</i>}
        <ul className="grid gap-2 grid-cols-3">
          {clients.map((client) => (
            <li
              key={client.id}
              className="bg-white gap-3 w-full hover:shadow-sm duration-75 p-4 rounded-sm flex flex-col"
            >
              <div className="flex justify-between items-center">
                <p className="font-bold">{client.name}</p>
                <button
                  onClick={() => fetchDelete(client.id)}
                  className="bg-red-500 cursor-pointer text-xs p-1 hover:bg-red-700 transition-100 text-white rounded-sm"
                >
                  Eliminar
                </button>
              </div>
              <i className="text-sm">{client.phone}</i>
              <i className="text-xs"># {client.id}</i>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
