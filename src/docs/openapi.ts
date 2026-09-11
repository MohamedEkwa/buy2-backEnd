import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";

import { openApiRegistry } from "./openapi.registry.js";

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(openApiRegistry.definitions);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Buy2 HRMS API",
      version: "1.0.0",
      description: "Buy2 HR Management System API",
    },
    servers: [{ url: "/api/v1" }],
  });
}
