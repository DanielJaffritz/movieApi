import z from "zod";


export const regiserSchema = z.object({
  name: z.string().trim(),
  email: z.string().trim().min(1, "email is required").email("provide a vald email").toLowerCase(),
  password: z.string.min(1, "password is required").min(6, "password must be at least 6 characters")
})
export const loginSchema = z.object({
  email: z.string().trim().min(1, "email is required").email("provide a vald email").toLowerCase(),
  password: z.string.min(1, "password is required")
})
