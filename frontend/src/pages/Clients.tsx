import { useState, useEffect } from "react";
import type { Client } from '../types/db'
import NewClientForm from "../components/NewClientForm";

export default function Clients() {

    const [clients, setClients] = useState<Client[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {

        const fetchClients = async () => {
            try {
                const res = await fetch("http://localhost:8080/clients");
                const data = await res.json();
                setClients(data);
            } catch (err) {
                setError("Error fetching clients");
                console.error("Error:", err);
            }
        };

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
                    <p className="font-bold">{client.name}</p>
                    <i className="text-sm">{client.phone}</i>
                    <i className="text-xs"># {client.id}</i>
                </li>
            )}
        </ul>
    </div>
}