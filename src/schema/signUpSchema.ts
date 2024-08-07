import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2)
  .max(10)
  .regex(/^[a-zA-Z0-9_]+$/, "Username Should not be special Characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Enter Valid Email" }),
  password: z
    .string()
    .min(6, { message: "Passowrd must be aleast 6 characters" }),
});
