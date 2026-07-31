import { type ClientForm } from "../types/clients";

export async function getClients(): Promise<Response> {
  return await fetch("http://localhost:8080/clients", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function postClient(formData: ClientForm): Promise<Response> {
  return await fetch(
    "http://localhost:8080/clients",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }
  );
}
