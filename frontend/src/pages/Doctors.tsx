import { useState } from "react";
import useDoctors from "../hooks/useDoctors";
import Table from "../components/Table";
import NewDoctorForm from "../components/NewDoctorForm";
import ModalContainer from "../components/ModalContainer";

export default function Doctors() {
  const [modal, setModal] = useState(false);
  const { doctors, error, addDoctor, fetchDelete } = useDoctors();

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
        Nuevo Doctor
      </button>

      {modal && (
        <ModalContainer closeFunction={handleModal}>
          <NewDoctorForm addDoctor={addDoctor} error={error} />
        </ModalContainer>
      )}

      <div className="pt-10">
        {doctors.length == 0 ? (
          <i>There is no doctors to show.</i>
        ) : (
          <Table
            data={doctors}
            cols={[
              { header: "ID", accessor: (row) => row.id },
              { header: "Name", accessor: (row) => row.name },
              { header: "Phone", accessor: (row) => row.phone },
              { header: "Email", accessor: (row) => row.email },
              { header: "Specialty", accessor: (row) => row.specialty },
            ]}
            onDelete={(id) => fetchDelete(id)}
          />
        )}
      </div>
    </div>
  );
}
