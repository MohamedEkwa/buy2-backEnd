import { z } from "zod";

export const apiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string().describe("Machine-readable application error code."),
    message: z.string(),
    details: z.array(z.unknown()),
  }),
});

export const uuidParamsSchema = z.object({
  id: z.uuid().describe("Resource identifier."),
});
