import {
  type AppointmentForList,
  type AppointmentListItem,
} from "../types/appointments";

const formatAppointmentToList = (
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

export default formatAppointmentToList;
