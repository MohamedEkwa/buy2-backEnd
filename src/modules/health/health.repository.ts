import { prisma } from "../../database/prisma.js";
import type { HealthRepository } from "./health.types.js";

export const healthRepository: HealthRepository = {
  async checkConnection(): Promise<void> {
    await prisma.$queryRaw`SELECT 1`;
  },
};
