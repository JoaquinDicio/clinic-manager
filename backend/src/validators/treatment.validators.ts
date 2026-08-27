import { z } from "zod";

export const CreateTreatmentDTO = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().nonnegative("Price cannot be negative"),
  active: z.boolean().default(true),
});

export type CreateTreatmentDTO = z.infer<typeof CreateTreatmentDTO>;
