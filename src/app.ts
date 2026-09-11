import express from "express";

import { getEnv } from "./config/env.js";
import { generateOpenApiDocument } from "./docs/openapi.js";
import { mountSwaggerUi } from "./docs/swagger.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { createApiRouter } from "./routes/index.js";
import type { RouteDependencies } from "./routes/index.js";

export function createApp(dependencies: RouteDependencies = {}) {
  const app = express();
  app.use(express.json());
  app.use("/api/v1", createApiRouter(dependencies));

  if (getEnv().API_DOCS_ENABLED) {
    const openApiDocument = generateOpenApiDocument();
    app.get("/api/v1/openapi.json", (_req, res) => res.json(openApiDocument));
    mountSwaggerUi(app, openApiDocument);
  }

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
  return app;
}

export const app = createApp();
