import type { AppointmentFullInfo } from "../db/db.js";

export interface TemplateVariableHint {
  key: string;
  description: string;
}

/*
 * Fuente única de verdad de las variables de templates.
 *
 * buildTemplateData aplana la info del turno a claves primitivas.
 * Para agregar una variable nueva: sumar una línea acá (y su hint
 * abajo). Nada más cambia: ni el resolver, ni los endpoints, ni el form.
 */
export function buildTemplateData(
  appointment: AppointmentFullInfo,
  formatted: { date: string; time: string },
): Record<string, string> {
  return {
    name: appointment.client.name,
    date: formatted.date,
    time: formatted.time,
    doctor: appointment.doctor?.name ?? "",
    treatments: appointment.treatments.map((t) => t.name).join(", "),
    note: appointment.note ?? "",
    slots: String(appointment.slots),
  };
}

export function getAvailableTemplateVariables(): TemplateVariableHint[] {
  return [
    { key: "name", description: "Nombre del cliente" },
    { key: "date", description: "Fecha del turno (DD/MM/AAAA)" },
    { key: "time", description: "Hora del turno (HH:MM)" },
    { key: "doctor", description: "Nombre del doctor" },
    { key: "treatments", description: "Tratamientos separados por coma" },
    { key: "note", description: "Nota del turno" },
    { key: "slots", description: "Duración en bloques de 30 min" },
  ];
}
