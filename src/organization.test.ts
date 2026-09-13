import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import type {
  OrganizationService,
  Organization,
} from "./modules/organization/organization.types.js";
import { AppError } from "./shared/errors/app-error.js";

const mockOrganizationId = "123e4567-e89b-12d3-a456-426614174000";
const mockOrganizationId2 = "223e4567-e89b-12d3-a456-426614174001";

const mockOrganization: Organization = {
  id: mockOrganizationId,
  name: "Test Organization",
  slug: "test-org",
  isActive: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const readyHealthService = {
  checkHealth: async () => ({ status: "UP" }),
};

const readyOrganizationService: OrganizationService = {
  getAll: async () => [mockOrganization],
  getById: async (id: string) => {
    if (id !== mockOrganizationId) {
      throw new AppError({
        message: "المنظمة المطلوبة غير موجودة",
        code: "NOT_FOUND",
        statusCode: 404,
      });
    }
    return mockOrganization;
  },
  getBySlug: async (slug: string) => {
    if (slug !== "test-org") return null;
    return mockOrganization;
  },
  create: async (input) => ({
    id: mockOrganizationId2,
    ...input,
    isActive: input.isActive ?? true,
    createdAt: new Date("2026-08-22T00:00:00.000Z"),
    updatedAt: new Date("2026-08-22T00:00:00.000Z"),
  }),
  update: async (id, input) => {
    if (id !== mockOrganizationId) {
      throw new AppError({
        message: "المنظمة المطلوبة غير موجودة",
        code: "NOT_FOUND",
        statusCode: 404,
      });
    }
    // Check slug uniqueness
    if (input.slug === "existing-slug") {
      throw new AppError({
        message: "يوجد منظمة أخرى مسجلة بهذا المعرف المختصر (Slug)",
        code: "SLUG_ALREADY_EXISTS",
        statusCode: 409,
      });
    }
    return {
      ...mockOrganization,
      ...input,
      updatedAt: new Date("2026-08-22T00:00:00.000Z"),
    };
  },
  remove: async (id: string) => {
    if (id !== mockOrganizationId) {
      throw new AppError({
        message: "المنظمة المطلوبة غير موجودة",
        code: "NOT_FOUND",
        statusCode: 404,
      });
    }
    return undefined;
  },
};

describe("Organization API", () => {
  it("returns all organizations", async () => {
    const response = await request(
      createApp({
        organizationService: readyOrganizationService,
      }),
    )
      .get("/api/v1/organizations")
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("name", "Test Organization");
    expect(response.body[0]).toHaveProperty("slug", "test-org");
    expect(response.body[0]).toHaveProperty("id", mockOrganizationId);
  });

  it("creates a new organization", async () => {
    const response = await request(
      createApp({
        organizationService: readyOrganizationService,
      }),
    )
      .post("/api/v1/organizations")
      .send({
        name: "New Organization",
        slug: "new-org",
        isActive: true,
      })
      .expect(201);

    expect(response.body).toHaveProperty("name", "New Organization");
    expect(response.body).toHaveProperty("slug", "new-org");
    expect(response.body).toHaveProperty("id");
  });

  it("returns an organization by id", async () => {
    const response = await request(
      createApp({
        organizationService: readyOrganizationService,
      }),
    )
      .get(`/api/v1/organizations/${mockOrganizationId}`)
      .expect(200);

    expect(response.body).toHaveProperty("id", mockOrganizationId);
    expect(response.body).toHaveProperty("name", "Test Organization");
    expect(response.body).toHaveProperty("slug", "test-org");
  });

  it("returns an organization by slug", async () => {
    const response = await request(
      createApp({
        organizationService: readyOrganizationService,
      }),
    )
      .get(`/api/v1/organizations/slug/test-org`)
      .expect(200);

    expect(response.body).toHaveProperty("slug", "test-org");
    expect(response.body).toHaveProperty("name", "Test Organization");
  });

  it("returns 404 for non-existent organization by slug", async () => {
    await request(
      createApp({
        organizationService: readyOrganizationService,
      }),
    )
      .get(`/api/v1/organizations/slug/non-existent`)
      .expect(404);
  });

  it("updates an organization", async () => {
    const response = await request(
      createApp({
        organizationService: readyOrganizationService,
      }),
    )
      .put(`/api/v1/organizations/${mockOrganizationId}`)
      .send({
        name: "Updated Organization",
        slug: "updated-org",
      })
      .expect(200);

    expect(response.body).toHaveProperty("name", "Updated Organization");
    expect(response.body).toHaveProperty("slug", "updated-org");
  });

  it("returns 409 for duplicate slug on update", async () => {
    await request(
      createApp({
        organizationService: readyOrganizationService,
      }),
    )
      .put(`/api/v1/organizations/${mockOrganizationId}`)
      .send({
        slug: "existing-slug",
      })
      .expect(409);
  });

  it("deletes an organization", async () => {
    await request(
      createApp({
        organizationService: readyOrganizationService,
      }),
    )
      .delete(`/api/v1/organizations/${mockOrganizationId}`)
      .expect(204);
  });

  it("returns 404 for non-existent organization", async () => {
    await request(
      createApp({
        organizationService: readyOrganizationService,
      }),
    )
      .get(`/api/v1/organizations/999e4567-e89b-12d3-a456-426614174999`)
      .expect(404);
  });

  it("returns 400 for invalid slug format (validation)", async () => {
    await request(
      createApp({
        organizationService: readyOrganizationService,
      }),
    )
      .post("/api/v1/organizations")
      .send({
        name: "Invalid Slug",
        slug: "Invalid_Slug!", // Invalid: uppercase and special chars
      })
      .expect(400);
  });
});
