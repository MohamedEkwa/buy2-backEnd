import { PrismaPg } from "@prisma/adapter-pg";

import { getEnv } from "../config/env.js";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: getEnv().DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

export async function initializeDatabase(): Promise<void> {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
