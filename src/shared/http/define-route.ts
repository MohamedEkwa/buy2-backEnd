import type { RequestHandler, Router } from "express";
import type { z, ZodType } from "zod";

import { registerOpenApiOperation } from "../../docs/openapi.registry.js";
import { validate } from "../../middleware/validate.middleware.js";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";
type SecurityRequirement = Record<string, string[]>;

type RouteRequestSchemas = {
  body?: ZodType;
  params?: z.ZodObject;
  query?: z.ZodObject;
  headers?: z.ZodObject;
};

type RouteResponse = {
  description: string;
  schema?: ZodType;
};

export type RouteDefinition = {
  operationId: string;
  method: HttpMethod;
  path: string;
  openapiPath?: string;
  tags: string[];
  summary: string;
  description?: string;
  request?: RouteRequestSchemas;
  responses: Record<number, RouteResponse>;
  middleware?: RequestHandler[];
  security?: SecurityRequirement[];
  handler: RequestHandler;
};

export function defineRoute(router: Router, definition: RouteDefinition): void {
  const middleware = definition.middleware ?? [];
  const validation = definition.request ? [validate(definition.request)] : [];
  router.route(definition.path)[definition.method](...middleware, ...validation, definition.handler);

  registerOpenApiOperation(definition.operationId, {
    method: definition.method,
    path: definition.openapiPath ?? definition.path,
    tags: definition.tags,
    summary: definition.summary,
    description: definition.description,
    security: definition.security,
    request: definition.request
      ? {
          params: definition.request.params,
          query: definition.request.query,
          headers: definition.request.headers,
          body: definition.request.body
            ? {
                content: {
                  "application/json": { schema: definition.request.body },
                },
              }
            : undefined,
        }
      : undefined,
    responses: Object.fromEntries(
      Object.entries(definition.responses).map(([status, response]) => [
        status,
        {
          description: response.description,
          content: response.schema
            ? { "application/json": { schema: response.schema } }
            : undefined,
        },
      ]),
    ),
  });
}
