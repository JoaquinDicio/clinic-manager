import NewAppointmentForm from "../components/NewAppointmentForm.tsx";
import {
  getAppointments,
  deleteAppointment,
} from "../services/appointments.service";
import { type Appointment } from "../types/db.ts";
import { useState, useEffect } from "react";

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const response = await getAppointments();

      const data = await response.json();

      setAppointments(data);
    } catch (err) {
      console.error("Error:", err);
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
    }
  }

  return (
    <div>
      <NewAppointmentForm setAppointments={setAppointments} />
      <ul className="pt-10 grid gap-2 grid-cols-3">
        {appointments.map((appointment) => (
          <li
            key={appointment.id}
            className="bg-white shadow-sm rounded-sm p-3"
          >
            <div className="flex justify-between items-center">
              <p className="font-bold text-sm">{appointment.date}</p>
              <button
                className="bg-red-500 cursor-pointer text-xs hover:bg-red-700 duration-100 p-1 text-white rounded-sm"
                onClick={() => fetchDelete(appointment.id)}
              >
                Eliminar
              </button>
            </div>
            <p>{appointment.time}</p>
            <i className="text-xs">Client : {appointment.client_id}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}
