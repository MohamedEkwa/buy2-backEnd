import type { Server } from "node:http";

import { app } from "./app.js";
import { getEnv } from "./config/env.js";
import { disconnectDatabase, initializeDatabase } from "./database/prisma.js";

async function start(): Promise<void> {
  const env = getEnv();
  await initializeDatabase();

  const server = app.listen(env.PORT, () => {
    console.info(`API listening on port ${env.PORT}.`);
  });

  registerGracefulShutdown(server);
}

function registerGracefulShutdown(server: Server): void {
  let isShuttingDown = false;

  const shutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.info(`${signal} received. Shutting down.`);

    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
}

start().catch(async (error: unknown) => {
  console.error("Failed to start API.", error);
  await disconnectDatabase();
  process.exit(1);
});
