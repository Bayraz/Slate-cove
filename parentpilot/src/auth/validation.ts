import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
});

export const emailSchema = credentialsSchema.shape.email;

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please check your details";
}
