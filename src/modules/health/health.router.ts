import { Router } from "express";

import { defineRoute } from "../../shared/http/define-route.js";
import { apiErrorResponseSchema } from "../../shared/http/schemas.js";
import { createHealthController } from "./health.controller.js";
import { healthResponseSchema } from "./health.schema.js";
import type { HealthService } from "./health.types.js";

export function createHealthRouter(service?: HealthService): Router {
  const router = Router();
  defineRoute(router, {
    operationId: "healthCheck",
    method: "get",
    path: "/health",
    tags: ["System"],
    summary: "Check API readiness",
    description: "Confirms that the API and PostgreSQL database are available.",
    responses: {
      200: {
        description: "API and database are ready.",
        schema: healthResponseSchema,
      },
      503: {
        description: "Database is unavailable.",
        schema: apiErrorResponseSchema,
      },
    },
    handler: createHealthController(service),
  });
  return router;
}
