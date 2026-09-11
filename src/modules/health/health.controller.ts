import type { RequestHandler } from "express";

import { healthService } from "./health.service.js";
import type { HealthService } from "./health.types.js";

export function createHealthController(service: HealthService = healthService): RequestHandler {
  return async (_req, res) => {
    const health = await service.check();
    res.status(200).json(health);
  };
}
