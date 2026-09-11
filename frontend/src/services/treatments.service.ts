import { type TreatmentForm } from "../types/treatments";

export async function postTreatment(
  formData: TreatmentForm,
): Promise<Response> {
  return await fetch("http://localhost:8080/treatments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
}

export async function getTreatments(): Promise<Response> {
  return await fetch("http://localhost:8080/treatments");
}

export async function deactivateTreatment(
  treatmentId: string,
): Promise<Response> {
  return await fetch(
    `http://localhost:8080/treatments/${treatmentId}/deactivate`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
