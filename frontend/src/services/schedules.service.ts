export async function getSchedules(): Promise<Response> {
  return await fetch("http://localhost:8080/schedules");
}
