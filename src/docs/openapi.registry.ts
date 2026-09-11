import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import type { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const openApiRegistry = new OpenAPIRegistry();

openApiRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const registeredOperationIds = new Set<string>();

export function registerOpenApiOperation(
  operationId: string,
  operation: RouteConfig,
): void {
  if (registeredOperationIds.has(operationId)) {
    return;
  }

  openApiRegistry.registerPath(operation);
  registeredOperationIds.add(operationId);
}
