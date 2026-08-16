import { z } from "zod";

export const CreateDoctorSchema = z.object({
  name: z.string().trim().min(1, "Doctor name is required"),

  phone: z.string().trim().optional().nullable(),

  email: z.string().trim().email("Invalid email").optional().nullable(),

  specialty: z.string().trim().optional().nullable(),
});

export type CreateDoctorDTO = z.infer<typeof CreateDoctorSchema>;
