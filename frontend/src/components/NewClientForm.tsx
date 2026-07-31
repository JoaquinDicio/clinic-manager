import type { Client } from "../types/db";
import { useState } from "react";
import { postClient } from "../services/clients.service";
import { type ClientForm } from "../types/clients";

interface Props {
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

export default function NewClientForm({ setClients }: Props) {

    const INITAL_FORM: ClientForm = { name: "", phone: "" };

    const [form, setForm] = useState<ClientForm>(INITAL_FORM);

    const [posting, setPosting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    }


    async function addClient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setPosting(true);
        setError(null);

        try {
            const res = await postClient(form);

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Error adding client");
            }

            const data: Client = await res.json();

            setClients(prev => [...prev, data]);

            setForm(INITAL_FORM);

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error adding client"
            );

            console.error("Error:", err);

        } finally {
            setPosting(false);
        }
    }


    return (
        <form
            onSubmit={addClient}
            className="flex items-start gap-3 flex-col"
        >
            <p>Agregar Cliente</p>

            <input
                name="name"
                type="text"
                placeholder="Nombre Cliente"
                value={form.name}
                onChange={handleChange}
                className="bg-white shadow-sm rounded-sm p-2"
            />

            <input
                name="phone"
                type="text"
                placeholder="Telefono"
                value={form.phone}
                onChange={handleChange}
                className="shadow-sm bg-white rounded-sm p-2"
            />

            <button
                disabled={posting}
                className="rounded-sm bg-blue-500 text-white p-2"
            >
                {posting ? "Agregando..." : "Agregar"}
            </button>

            {error && (
                <p className="text-red-500">
                    {error}
                </p>
            )}
        </form>
    );
}