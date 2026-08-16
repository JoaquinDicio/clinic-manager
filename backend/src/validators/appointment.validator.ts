import { z } from "zod";

export const CreateAppointmentSchema = z.object({
  clientId: z.string().uuid("Client ID inválido"),

  doctorId: z.string().uuid("Doctor ID inválido").optional(),

  date: z.string().date("La fecha es inválida"),

  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida"),

  reminder: z.boolean().optional(),

  templateId: z.string().uuid("Template ID inválido").optional(),

  slots: z
    .number()
    .int("Debe ser un número entero")
    .positive("Debe ser mayor a 0"),

  note: z.string().optional(),
});

export type CreateAppointmentDTO = z.infer<typeof CreateAppointmentSchema>;
