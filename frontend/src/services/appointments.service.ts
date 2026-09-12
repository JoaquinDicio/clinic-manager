import {
  type AppointmentForm,
  type AppointmentListItem,
  type AppointmentForList,
} from "../types/appointments";

const formatAppointment = (
  appointment: AppointmentForList,
): AppointmentListItem => {
  const [hours, minutes] = appointment.time
    .toString()
    .slice(0, 5)
    .split(":")
    .map(Number);

  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + appointment.slots * 30;

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}`;

  const formattedEndTime = `${String(Math.floor(endMinutes / 60) % 24).padStart(
    2,
    "0",
  )}:${String(endMinutes % 60).padStart(2, "0")}`;

  return {
    ...appointment,
    formattedDate: new Date(appointment.date).toLocaleDateString("es-AR"),
    formattedTime,
    formattedEndTime,
  };
};

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

  return formatAppointment(data);
}

export async function getAppointments(): Promise<AppointmentListItem[]> {
  const response = await fetch("http://localhost:8080/appointments?type=list");

  const data = await response.json();

  return data.map((appointment: AppointmentForList) =>
    formatAppointment(appointment),
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
