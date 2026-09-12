import {
  type AppointmentForm,
  type AppointmentListItem,
  type AppointmentForList,
} from "../types/appointments";
import formatAppointmentToList from "../utils/formatAppointmentToList";

export async function postAppointment(
  formData: AppointmentForm,
): Promise<AppointmentListItem> {
  const response = await fetch("http://localhost:8080/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Error creating appointment");
  }

  const data = await response.json();

  return formatAppointmentToList(data);
}

export async function getAppointments(): Promise<AppointmentListItem[]> {
  const response = await fetch("http://localhost:8080/appointments?type=list");

  const data = await response.json();

  return data.map((appointment: AppointmentForList) =>
    formatAppointmentToList(appointment),
  );
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
