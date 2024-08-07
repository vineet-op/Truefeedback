import { z } from "zod";

export const acceptMessageSchema = z.object({
  accept: z.boolean(),
});
