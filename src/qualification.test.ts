import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import type {
  QualificationService,
  Qualification,
} from "./modules/qualification/qualification.types.js";
import { AppError } from "./shared/errors/app-error.js";

const mockOrganizationId = "123e4567-e89b-12d3-a456-426614174000";
const mockQualificationId = "423e4567-e89b-12d3-a456-426614174004";

const mockQualification: Qualification = {
  id: mockQualificationId,
  organizationId: mockOrganizationId,
  name: "Bachelor's Degree",
  description: "University degree",
  isActive: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const readyHealthService = {
  checkHealth: async () => ({ status: "UP" }),
};

const readyQualificationService: QualificationService = {
  getAll: async () => [mockQualification],
  getById: async (id: string) => {
    if (id !== mockQualificationId) {
      throw new AppError({
        message: "المؤهل المطلوب غير موجود",
        code: "QUALIFICATION_NOT_FOUND",
        statusCode: 404,
      });
    }
    return mockQualification;
  },
  create: async (input) => ({
    id: "523e4567-e89b-12d3-a456-426614174005",
    ...input,
    isActive: input.isActive ?? true,
    createdAt: new Date("2026-08-22T00:00:00.000Z"),
    updatedAt: new Date("2026-08-22T00:00:00.000Z"),
  }),
  update: async (id, input) => {
    if (id !== mockQualificationId) {
      throw new AppError({
        message: "المؤهل المطلوب غير موجود",
        code: "QUALIFICATION_NOT_FOUND",
        statusCode: 404,
      });
    }
    return {
      ...mockQualification,
      ...input,
      updatedAt: new Date("2026-08-22T00:00:00.000Z"),
    };
  },
  remove: async (id: string) => {
    if (id !== mockQualificationId) {
      throw new AppError({
        message: "المؤهل المطلوب غير موجود",
        code: "QUALIFICATION_NOT_FOUND",
        statusCode: 404,
      });
    }
    return undefined;
  },
};

describe("Qualification API", () => {
  it("returns all qualifications", async () => {
    const response = await request(
      createApp({
        qualificationService: readyQualificationService,
      }),
    )
      .get("/api/v1/qualifications")
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("name", "Bachelor's Degree");
    expect(response.body[0]).toHaveProperty("organizationId", mockOrganizationId);
  });

  it("creates a new qualification", async () => {
    const response = await request(
      createApp({
        qualificationService: readyQualificationService,
      }),
    )
      .post("/api/v1/qualifications")
      .send({
        organizationId: mockOrganizationId,
        name: "Master's Degree",
        description: "Graduate degree",
      })
      .expect(201);

    expect(response.body).toHaveProperty("name", "Master's Degree");
    expect(response.body).toHaveProperty("id");
  });

  it("returns a qualification by id", async () => {
    const response = await request(
      createApp({
        qualificationService: readyQualificationService,
      }),
    )
      .get(`/api/v1/qualifications/${mockQualificationId}`)
      .expect(200);

    expect(response.body).toHaveProperty("id", mockQualificationId);
    expect(response.body).toHaveProperty("name", "Bachelor's Degree");
  });

  it("updates a qualification", async () => {
    const response = await request(
      createApp({
        qualificationService: readyQualificationService,
      }),
    )
      .put(`/api/v1/qualifications/${mockQualificationId}`)
      .send({
        name: "PhD",
        description: "Doctorate degree",
      })
      .expect(200);

    expect(response.body).toHaveProperty("name", "PhD");
    expect(response.body).toHaveProperty("description", "Doctorate degree");
  });

  it("deletes a qualification", async () => {
    await request(
      createApp({
        qualificationService: readyQualificationService,
      }),
    )
      .delete(`/api/v1/qualifications/${mockQualificationId}`)
      .expect(204);
  });

  it("returns 404 for non-existent qualification", async () => {
    await request(
      createApp({
        qualificationService: readyQualificationService,
      }),
    )
      .get(`/api/v1/qualifications/999e4567-e89b-12d3-a456-426614174999`)
      .expect(404);
  });
});