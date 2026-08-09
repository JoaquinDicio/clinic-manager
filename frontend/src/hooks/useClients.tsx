import { useState, useEffect } from "react";
import {
  getClients,
  deleteClient,
  postClient,
} from "../services/clients.service";
import { type Client } from "../types/db";
import { type ClientForm } from "../types/clients";

type Config = {
  fetchOnMount?: boolean;
};

export default function useClients({ fetchOnMount = true }: Config = {}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (fetchOnMount) {
      fetchClients();
    }
  }, [fetchOnMount]);

  async function fetchClients() {
    try {
      const response = await getClients();

      if (!response.ok) {
        throw new Error("Error fetching clients");
      }

      const data = await response.json();
      setClients(data);
    } catch (err) {
      console.error("Error:", err);
      setError("Error fetching clients");
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
      setActionError("Error deleting client");
      console.error("Error:", err);
    }
  }

  async function addClient(client: ClientForm) {
    setError(null); // reset error every time we add a new client

    try {
      const response = await postClient(client);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error creating client");
      }

      setClients((prevClients) => [...prevClients, data]);

      return data;
    } catch (err) {
      if (err instanceof Error) {
        setActionError(err.message);
      } else {
        setActionError("Error creating client");
      }
      console.error("Error:", err);
    }
  }

  async function searchClients(search: string) {
    try {
      const response = await getClients(search);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error:", err);
      setError("Error fetching clients");
    }
  }

  return { clients, error, actionError, fetchDelete, addClient, searchClients };
}
