import type { Client } from '../types/db'
import { useState } from "react";

interface Props {
    setClients: React.Dispatch<React.SetStateAction<Client[]>>
}

export default function NewClientForm({ setClients }: Props) {

    const [posting, setPosting] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    async function addClient(e: React.FormEvent<HTMLFormElement>) {

        e.preventDefault();
        setPosting(true)
        setError(null)

        try {
            const form = e.currentTarget;
            const formData = new FormData(form);

            const newClient = {
                name: formData.get("name"),
                phone: formData.get("phone"),
            };

            const res = await fetch("http://localhost:8080/clients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newClient),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Error adding client");
            }

            const data: Client = await res.json();
            setClients(prev => [...prev, data])
            form.reset()

        } catch (err) {
            setError(err instanceof Error ? err.message : "Error adding client");
            console.error("Error:", err);
        }
        finally {
            setPosting(false)
        }
    }
    return <form onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => addClient(e)} className="flex items-start gap-3 flex-col">
        <p>Agregar Cliente</p>
        <input name="name" type="text" placeholder="Nombre Cliente" className="bg-white shadow-sm rounded-sm p-2" />
        <input name="phone" type="text" placeholder="Telefono" className="shadow-sm bg-white rounded-sm p-2" />
        <button disabled={posting} className="rounded-sm bg-blue-500 text-white p-2">
            {posting ? "Agregando..." : "Agregar"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
    </form>
}