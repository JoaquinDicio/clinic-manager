import { useEffect, useState } from "react";
import useClients from "../hooks/useClients";
import { type Client } from "../types/db";

interface Props {
  onChange: (clientId: string) => void;
}

export default function ClientAutocomplete({ onChange }: Props) {
  const { searchClients } = useClients({
    fetchOnMount: false,
  });

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (search.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const clients = await searchClients(search);
      setResults(clients);
      setOpen(true);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  function handleSelect(client: Client) {
    setSearch(client.name);
    onChange(client.id);
    setOpen(false);
  }

  return (
    <div className="relative">
      <input
        className="rounded p-2 w-full bg-white shadow-sm"
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange("");
        }}
        onFocus={() => {
          if (results.length > 0) {
            setOpen(true);
          }
        }}
        placeholder="Buscar cliente..."
      />

      {open && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded border bg-white shadow">
          {results.map((client) => (
            <li
              key={client.id}
              onClick={() => handleSelect(client)}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
            >
              <p>{client.name}</p>
              <span className="text-sm text-gray-500">{client.phone}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
