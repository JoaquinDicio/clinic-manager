import {
  type AppointmentWithClient,
  type AppointmentForm,
} from "../types/appointments";
import { useState, useEffect } from "react";
import {
  getAppointments,
  deleteAppointment,
  postAppointment,
} from "../services/appointments.service";

export default function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const response = await getAppointments();
      setAppointments(response);
    } catch (err) {
      console.error("Error:", err);
      setError("Error fetching appointments");
    }
  }

  async function fetchDelete(appointmentId: string) {
    try {
      const response = await deleteAppointment(appointmentId);

      if (response.ok) {
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment.id !== appointmentId,
          ),
        );
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error deleting appointment");
    }
  }

  async function addAppointment(appointment: AppointmentForm) {
    setError(null); // reset error every time we add a new appointment

    try {
      const data = await postAppointment(appointment);
      setAppointments((prevAppointments) => [...prevAppointments, data]);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        setActionError(err.message);
      } else {
        setActionError("Error creating appointment");
      }
      console.error("Error:", err);
    }
  }

  return { appointments, error, fetchDelete, addAppointment, actionError };
}
