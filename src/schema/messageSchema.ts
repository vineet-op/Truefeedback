import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be of 10 Characters" })
    .max(300, { message: "Content must be no longer than of 300 Characters" }),
});
