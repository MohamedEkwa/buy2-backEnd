import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import type {
  SeniorityLevelService,
  SeniorityLevel,
} from "./modules/seniority-level/seniority-level.types.js";
import { AppError } from "./shared/errors/app-error.js";

const mockOrganizationId = "123e4567-e89b-12d3-a456-426614174000";
const mockSeniorityLevelId = "323e4567-e89b-12d3-a456-426614174003";

const mockSeniorityLevel: SeniorityLevel = {
  id: mockSeniorityLevelId,
  organizationId: mockOrganizationId,
  name: "Senior",
  rank: 3,
  isActive: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const readyHealthService = {
  checkHealth: async () => ({ status: "UP" }),
};

const readySeniorityLevelService: SeniorityLevelService = {
  getAll: async () => [mockSeniorityLevel],
  getById: async (id: string) => {
    if (id !== mockSeniorityLevelId) {
      throw new AppError({
        message: "المستوى الوظيفي المطلوب غير موجود",
        code: "NOT_FOUND",
        statusCode: 404,
      });
    }
    return mockSeniorityLevel;
  },
  create: async (input) => ({
    id: "423e4567-e89b-12d3-a456-426614174004",
    ...input,
    isActive: input.isActive ?? true,
    createdAt: new Date("2026-08-22T00:00:00.000Z"),
    updatedAt: new Date("2026-08-22T00:00:00.000Z"),
  }),
  update: async (id, input) => {
    if (id !== mockSeniorityLevelId) {
      throw new AppError({
        message: "المستوى الوظيفي المطلوب غير موجود",
        code: "NOT_FOUND",
        statusCode: 404,
      });
    }
    return {
      ...mockSeniorityLevel,
      ...input,
      updatedAt: new Date("2026-08-22T00:00:00.000Z"),
    };
  },
  remove: async (id: string) => {
    if (id !== mockSeniorityLevelId) {
      throw new AppError({
        message: "المستوى الوظيفي المطلوب غير موجود",
        code: "NOT_FOUND",
        statusCode: 404,
      });
    }
    return undefined;
  },
};

describe("Seniority Level API", () => {
  it("returns all seniority levels", async () => {
    const response = await request(
      createApp({
        seniorityLevelService: readySeniorityLevelService,
      }),
    )
      .get("/api/v1/seniority-levels")
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("name", "Senior");
    expect(response.body[0]).toHaveProperty(
      "organizationId",
      mockOrganizationId,
    );
    expect(response.body[0]).toHaveProperty("rank", 3);
  });

  it("creates a new seniority level", async () => {
    const response = await request(
      createApp({
        seniorityLevelService: readySeniorityLevelService,
      }),
    )
      .post("/api/v1/seniority-levels")
      .send({
        organizationId: mockOrganizationId,
        name: "Junior",
        rank: 1,
        isActive: true,
      })
      .expect(201);

    expect(response.body).toHaveProperty("name", "Junior");
    expect(response.body).toHaveProperty("rank", 1);
    expect(response.body).toHaveProperty("id");
  });

  it("returns a seniority level by id", async () => {
    const response = await request(
      createApp({
        seniorityLevelService: readySeniorityLevelService,
      }),
    )
      .get(`/api/v1/seniority-levels/${mockSeniorityLevelId}`)
      .expect(200);

    expect(response.body).toHaveProperty("id", mockSeniorityLevelId);
    expect(response.body).toHaveProperty("name", "Senior");
    expect(response.body).toHaveProperty("rank", 3);
  });

  it("updates a seniority level", async () => {
    const response = await request(
      createApp({
        seniorityLevelService: readySeniorityLevelService,
      }),
    )
      .put(`/api/v1/seniority-levels/${mockSeniorityLevelId}`)
      .send({
        name: "Senior Engineer",
        rank: 4,
      })
      .expect(200);

    expect(response.body).toHaveProperty("name", "Senior Engineer");
    expect(response.body).toHaveProperty("rank", 4);
  });

  it("deletes a seniority level", async () => {
    await request(
      createApp({
        seniorityLevelService: readySeniorityLevelService,
      }),
    )
      .delete(`/api/v1/seniority-levels/${mockSeniorityLevelId}`)
      .expect(204);
  });

  it("returns 404 for non-existent seniority level", async () => {
    await request(
      createApp({
        seniorityLevelService: readySeniorityLevelService,
      }),
    )
      .get(`/api/v1/seniority-levels/999e4567-e89b-12d3-a456-426614174999`)
      .expect(404);
  });

  it("returns 400 for invalid rank (validation)", async () => {
    await request(
      createApp({
        seniorityLevelService: readySeniorityLevelService,
      }),
    )
      .post("/api/v1/seniority-levels")
      .send({
        organizationId: mockOrganizationId,
        name: "Invalid Rank",
        rank: 0, // Invalid: must be >= 1
      })
      .expect(400);
  });
});
