import { z } from 'zod'

export const CreateClientSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name field is mandatory"),
    phone: z
        .string()
        .trim()
        .min(8, "Phone number is invalid"),
});

export type CreateClientDTO =
    z.infer<typeof CreateClientSchema>;