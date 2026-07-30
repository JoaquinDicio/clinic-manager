export async function getClients(): Promise<Response> {
    return await fetch(
        "http://localhost:8080/clients",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}