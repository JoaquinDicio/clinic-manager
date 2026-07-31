import NewAppointmentForm from "../components/NewAppointmentForm.tsx";
import {
  getAppointments,
  deleteAppointment,
} from "../services/appointments.service";
import { type Appointment } from "../types/db.ts";
import { useState, useEffect } from "react";
import ModalContainer from "../components/ModalContainer";

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<boolean>(false);

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

  function handleModal() {
    setModal(!modal);
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <button
        onClick={handleModal}
        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded"
      >
        New Appointment
      </button>
      {modal && (
        <ModalContainer closeFunction={handleModal}>
          <NewAppointmentForm setAppointments={setAppointments} />
        </ModalContainer>
      )}
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
