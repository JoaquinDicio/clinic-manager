import type { Client } from "../types/db";
import { useState } from "react";
import { type ClientForm } from "../types/clients";

interface Props {
  addClient: (client: ClientForm) => Promise<Client>;
  error: string | null;
}

export default function NewClientForm({ addClient, error }: Props) {
  const INITAL_FORM: ClientForm = { name: "", phone: "" };
  const [form, setForm] = useState<ClientForm>(INITAL_FORM);
  const [posting, setPosting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPosting(true);
    const newClient = await addClient(form);

    if (newClient) {
      setForm(INITAL_FORM);
    }

    setPosting(false);
  }

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
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

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
