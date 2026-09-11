import { AppError } from "../../shared/errors/app-error.js";
import { ERROR_CODES } from "../../shared/errors/error-codes.js";
import { healthRepository } from "./health.repository.js";
import type { HealthRepository, HealthService, HealthStatus } from "./health.types.js";

export function createHealthService(repository: HealthRepository = healthRepository): HealthService {
  return {
    async check(): Promise<HealthStatus> {
      try {
        await repository.checkConnection();
      } catch {
        throw new AppError({
          code: ERROR_CODES.SERVICE_UNAVAILABLE,
          statusCode: 503,
          message: "Database is unavailable.",
        });
      }

      return { status: "ok" };
    },
  };
}

export const healthService = createHealthService();
