import { z } from "zod";

export const CreateScheduleSchema = z.object({
  templateId: z.string().uuid("Template ID inválido"),

  clientId: z.string().uuid("Client ID inválido"),

  appointmentId: z
    .string()
    .uuid("Appointment ID inválido")
    .nullable()
    .optional(),

  body: z.string().min(1, "El mensaje no puede estar vacío"),

  sendAt: z.string().datetime("La fecha de envío es inválida"),
});

export type CreateScheduleDTO = z.infer<typeof CreateScheduleSchema>;
