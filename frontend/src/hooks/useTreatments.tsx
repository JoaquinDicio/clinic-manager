import { useEffect, useState } from "react";

import {
  getTreatments,
  deactivateTreatment,
  postTreatment,
} from "../services/treatments.service";

import { type Treatment, type TreatmentForm } from "../types/treatments";

export default function useTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchTreatments();
  }, []);

  async function fetchTreatments() {
    try {
      const response = await getTreatments();
      const data = await response.json();
      setTreatments(data);
    } catch (err) {
      setError("Error fetching treatments");
      console.error("Error:", err);
    }
  }

  async function deactivateTreatmentById(treatmentId: string) {
    try {
      const response = await deactivateTreatment(treatmentId);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error deactivating treatment");
      }

      setTreatments((prevTreatments) =>
        prevTreatments.map((treatment) =>
          treatment.id === treatmentId
            ? { ...treatment, active: false }
            : treatment,
        ),
      );
    } catch (err) {
      setError("Error deactivating treatment");
      console.error("Error:", err);
    }
  }

  async function addTreatment(treatment: TreatmentForm) {
    setError(null);
    setActionError(null);

    try {
      const response = await postTreatment(treatment);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error creating treatment");
      }

      setTreatments((prevTreatments) => [...prevTreatments, data]);

      return data;
    } catch (err) {
      if (err instanceof Error) {
        setActionError(err.message);
      } else {
        setActionError("Error creating treatment");
      }
    }
  }

  return {
    treatments,
    error,
    deactivateTreatment: deactivateTreatmentById,
    addTreatment,
    actionError,
  };
}
