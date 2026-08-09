import { type ClientForm } from "../types/clients";

export async function getClients(search?: string): Promise<Response> {
  if (search) {
    return await fetch(`http://localhost:8080/clients?search=${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return await fetch(`http://localhost:8080/clients?`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function postClient(formData: ClientForm): Promise<Response> {
  return await fetch("http://localhost:8080/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
}

export async function deleteClient(cliendId: string): Promise<Response> {
  return await fetch(`http://localhost:8080/clients/${cliendId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
