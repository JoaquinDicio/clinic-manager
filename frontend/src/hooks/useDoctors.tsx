import { useEffect, useState } from "react";
import doctorsService from "../services/doctors.services";
import { type Doctor } from "../types/db.js";
import { type DoctorDTO } from "../types/doctor.js";

export default function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchDoctors() {
    try {
      const response = await doctorsService.getAll();
      setDoctors(await response.json());
    } catch (err) {
      console.error("Error:", err);
      setError("Error fetching doctors");
    }
  }

  async function addDoctor(doctor: DoctorDTO) {
    try {
      const response = await doctorsService.create(doctor);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error creating doctor");
      }

      setDoctors((prevDoctors) => [...prevDoctors, data]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error creating doctor");
      }
      console.error("Error:", err);
    }
  }

  async function fetchDelete(doctorId: string) {
    try {
      const response = await doctorsService.delete(doctorId);

      if (response.ok) {
        setDoctors((prevDoctors) =>
          prevDoctors.filter((doctor) => doctor.id !== doctorId),
        );
      }
    } catch (err) {
      setError("Error deleting doctor");
      console.error("Error:", err);
    }
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

  return { doctors, error, addDoctor, fetchDelete };
}
