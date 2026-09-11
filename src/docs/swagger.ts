import type { Express, RequestHandler } from "express";
import swaggerUi from "swagger-ui-express";

import type { generateOpenApiDocument } from "./openapi.js";

export function mountSwaggerUi(app: Express, document: ReturnType<typeof generateOpenApiDocument>): void {
  const serve = swaggerUi.serve as unknown as RequestHandler[];
  app.use("/docs", ...serve, swaggerUi.setup(document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));
}
