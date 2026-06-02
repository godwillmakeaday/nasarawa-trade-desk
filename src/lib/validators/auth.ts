import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  // Optional post-login redirect target; only internal paths are honored by
  // the action to avoid open redirects. FormData.get returns null when absent,
  // so accept null and normalize to undefined.
  next: z.string().nullish().transform((value) => value ?? undefined)
});

export type LoginInput = z.infer<typeof loginSchema>;
