import { useState, useEffect } from "react";
import type { Client } from '../types/db'
import NewClientForm from "../components/NewClientForm";
import { getClients, deleteClient } from "../services/clients.service";

export default function Clients() {

    const [clients, setClients] = useState<Client[]>([])
    const [error, setError] = useState<string | null>(null)

    async function fetchClients() {
        try {
            const response = await getClients();
            const data = await response.json();
            setClients(data);
        } catch (err) {
            setError("Error fetching clients");
            console.error("Error:", err);
        }
    };

    async function fetchDelete(clientId: string) {
        try {
            const response = await deleteClient(clientId);
            if (response.ok) {
                setClients(prevClients => prevClients.filter(client => client.id !== clientId));
            }
        } catch (err) {
            setError("Error deleting client");
            console.error("Error:", err);
        }
    }

    useEffect(() => {
        fetchClients();
    }, []);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return <div>
        <NewClientForm setClients={setClients} />
        <ul className="pt-10 grid gap-2 grid-cols-3">
            {clients.map((client) =>
                <li key={client.id} className="bg-white gap-3 w-full hover:shadow-sm duration-75 p-4 rounded-sm flex flex-col">
                    <div className="flex justify-between items-center">
                        <p className="font-bold">{client.name}</p>
                        <button onClick={() => fetchDelete(client.id)} className="bg-red-500 cursor-pointer text-xs p-1 hover:bg-red-700 transition-100 text-white rounded-sm">Eliminar</button>
                    </div>
                    <i className="text-sm">{client.phone}</i>
                    <i className="text-xs"># {client.id}</i>
                </li>
            )}
        </ul>
    </div>
}