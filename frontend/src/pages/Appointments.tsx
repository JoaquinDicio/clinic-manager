import NewAppointmentForm from "../components/NewAppointmentForm.tsx";
import {
  getAppointments,
  deleteAppointment,
} from "../services/appointments.service";
import { useState, useEffect } from "react";
import ModalContainer from "../components/ModalContainer";
import { type AppointmentsWithClient } from "../types/appointments";
import Table from "../components/Table";

export default function Appointments() {
  const [appointments, setAppointments] = useState<AppointmentsWithClient[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<boolean>(false);

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
      <div className="pt-10">
        {appointments.length == 0 ? (
          <i>There is no appointments to show.</i>
        ) : (
          <Table
            cols={[
              { header: "ID", accessor: (row) => row.id },
              { header: "Client", accessor: (row) => row.client.name },
              { header: "Date", accessor: (row) => row.formattedDate },
              { header: "Time", accessor: (row) => row.time },
            ]}
            data={appointments}
            onDelete={(id) => fetchDelete(id)}
          />
        )}
      </div>
    </div>
  );
}
