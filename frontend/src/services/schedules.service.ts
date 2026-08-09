export async function getSchedules(): Promise<Response> {
  return await fetch("http://localhost:8080/schedules");
}

export async function deleteSchedule(id: string): Promise<Response> {
  return await fetch(`http://localhost:8080/schedules/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
