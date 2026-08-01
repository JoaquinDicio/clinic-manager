import {
  type AppointmentForm,
  type AppointmentsWithClient,
} from "../types/appointments";
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

export async function getAppointments(): Promise<AppointmentsWithClient[]> {
  const response = await fetch(
    "http://localhost:8080/appointments?include=client",
  );
  const data = await response.json();
  const appointments = data.map((appointment: AppointmentsWithClient) => ({
    ...appointment,
    formatted_date: new Date(appointment.date).toLocaleDateString(),
  }));
  return appointments;
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
