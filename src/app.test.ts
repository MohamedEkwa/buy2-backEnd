import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createApp } from "./app.js";
import type { HealthService } from "./modules/health/health.types.js";

const readyHealthService: HealthService = {
  check: async () => ({ status: "ok" }),
};

const originalApiDocsEnabled = process.env.API_DOCS_ENABLED;

afterEach(() => {
  if (originalApiDocsEnabled === undefined) {
    delete process.env.API_DOCS_ENABLED;
  } else {
    process.env.API_DOCS_ENABLED = originalApiDocsEnabled;
  }
  vi.resetModules();
});

describe("API application", () => {
  it("returns a ready health response", async () => {
    const response = await request(createApp({ healthService: readyHealthService }))
      .get("/api/v1/health")
      .expect(200);

    expect(response.body).toEqual({ status: "ok" });
  });

  it("returns the standardized not-found response", async () => {
    const response = await request(createApp({ healthService: readyHealthService }))
      .get("/api/v1/missing")
      .expect(404);

    expect(response.body.error).toMatchObject({
      code: "NOT_FOUND",
      message: "Route GET /api/v1/missing was not found.",
      details: [],
    });
  });

  it("exposes the health contract through OpenAPI", async () => {
    const response = await request(createApp({ healthService: readyHealthService }))
      .get("/api/v1/openapi.json")
      .expect(200);

    expect(response.body.openapi).toBe("3.1.0");
    expect(response.body.paths["/health"].get.responses["200"].content["application/json"].schema)
      .toBeDefined();
    expect(response.body.components.securitySchemes.bearerAuth).toMatchObject({
      type: "http",
      scheme: "bearer",
    });
    expect(response.body.paths["/health"].get.responses["200"].content["application/json"].schema)
      .toMatchObject({
        type: "object",
        properties: {
          status: {
            enum: ["ok"],
            description: "The service and database are ready.",
          },
        },
      });
  });

  it("serves Swagger UI", async () => {
    const response = await request(createApp({ healthService: readyHealthService }))
      .get("/docs/")
      .expect(200);

    expect(response.text).toContain("Swagger UI");
  });

  it("does not expose API documentation when disabled", async () => {
    process.env.API_DOCS_ENABLED = "false";
    vi.resetModules();

    const { createApp: createAppWithoutDocs } = await import("./app.js");
    const appWithoutDocs = createAppWithoutDocs({ healthService: readyHealthService });

    await request(appWithoutDocs).get("/api/v1/openapi.json").expect(404);
    await request(appWithoutDocs).get("/docs/").expect(404);
  });
});
