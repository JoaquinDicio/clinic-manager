import NewAppointmentForm from "../components/NewAppointmentForm.tsx";
import ModalContainer from "../components/ModalContainer";
import AppointmentCard from "../components/AppointmentCard";
import useAppointments from "../hooks/useAppointments";
import { useState } from "react";

export default function Appointments() {
  const [modal, setModal] = useState(false);
  const { appointments, error, fetchDelete, addAppointment, actionError } =
    useAppointments();

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
          <NewAppointmentForm
            error={actionError}
            addAppointment={addAppointment}
          />
        </ModalContainer>
      )}
      <div className="pt-10">
        {appointments.length == 0 ? (
          <i>There is no appointments to show.</i>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onDelete={() => fetchDelete(appointment.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
