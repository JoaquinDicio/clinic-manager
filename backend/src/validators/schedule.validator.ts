import { z } from "zod";

export const CreateScheduleSchema = z.object({
    templateId: z
        .string()
        .uuid("Template ID inválido"),

    clientId: z
        .string()
        .uuid("Client ID inválido"),

    sendAt: z
        .string()
        .date("La fecha es inválida"),

    variables: z
        .record(z.string(), z.string())
        .optional()
});

export type CreateScheduleDTO =
    z.infer<typeof CreateScheduleSchema>;