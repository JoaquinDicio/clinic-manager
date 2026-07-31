import { type AppointmentForm } from "../types/appointments";

export async function postAppointment(
  formData: AppointmentForm,
): Promise<Response> {
  return await fetch("http://localhost:8080/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
}

export async function getAppointments(): Promise<Response> {
  return await fetch("http://localhost:8080/appointments");
}

export async function deleteAppointment(
  appointmentId: string,
): Promise<Response> {
  return await fetch(`http://localhost:8080/appointments/${appointmentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
