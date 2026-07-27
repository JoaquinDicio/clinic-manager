import { z } from 'zod'

export const CreateTemplateSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name field is mandatory"),
    body: z
        .string()
        .trim()
        .min(1, "Body field is mandatory"),
    variables: z
        .array(z.string())
        .optional()
});

export type CreateTemplateDTO =
    z.infer<typeof CreateTemplateSchema>;