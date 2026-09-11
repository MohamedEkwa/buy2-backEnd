import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok").describe("The service and database are ready."),
}).describe("Service readiness response.");
