import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import type {
  DepartmentService,
  Department,
} from "./modules/department/department.types.js";
import { AppError } from "./shared/errors/app-error.js";

const mockOrganizationId = "123e4567-e89b-12d3-a456-426614174000";
const mockDepartmentId = "223e4567-e89b-12d3-a456-426614174001";

const mockDepartment: Department = {
  id: mockDepartmentId,
  organizationId: mockOrganizationId,
  name: "Engineering",
  description: "Software development department",
  isActive: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const readyHealthService = {
  checkHealth: async () => ({ status: "UP" }),
};

const readyDepartmentService: DepartmentService = {
  getAll: async () => [mockDepartment],
  getById: async (id: string) => {
    if (id !== mockDepartmentId) {
      throw new AppError({
        message: "القسم المطلوب غير موجود",
        code: "NOT_FOUND",
        statusCode: 404,
      });
    }
    return mockDepartment;
  },
  create: async (input) => ({
    id: "323e4567-e89b-12d3-a456-426614174002",
    ...input,
    isActive: input.isActive ?? true,
    createdAt: new Date("2026-08-22T00:00:00.000Z"),
    updatedAt: new Date("2026-08-22T00:00:00.000Z"),
  }),
  update: async (id, input) => {
    if (id !== mockDepartmentId) {
      throw new AppError({
        message: "القسم المطلوب غير موجود",
        code: "NOT_FOUND",
        statusCode: 404,
      });
    }
    return {
      ...mockDepartment,
      ...input,
      updatedAt: new Date("2026-08-22T00:00:00.000Z"),
    };
  },
  remove: async (id: string) => {
    if (id !== mockDepartmentId) {
      throw new AppError({
        message: "القسم المطلوب غير موجود",
        code: "NOT_FOUND",
        statusCode: 404,
      });
    }
    return undefined;
  },
};

describe("Department API", () => {
  it("returns all departments", async () => {
    const response = await request(
      createApp({
        departmentService: readyDepartmentService,
      }),
    )
      .get("/api/v1/departments")
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("name", "Engineering");
    expect(response.body[0]).toHaveProperty(
      "organizationId",
      mockOrganizationId,
    );
  });

  it("creates a new department", async () => {
    const response = await request(
      createApp({
        departmentService: readyDepartmentService,
      }),
    )
      .post("/api/v1/departments")
      .send({
        organizationId: mockOrganizationId,
        name: "Human Resources",
        description: "HR department",
      })
      .expect(201);

    expect(response.body).toHaveProperty("name", "Human Resources");
    expect(response.body).toHaveProperty("id");
  });

  it("returns a department by id", async () => {
    const response = await request(
      createApp({
        departmentService: readyDepartmentService,
      }),
    )
      .get(`/api/v1/departments/${mockDepartmentId}`)
      .expect(200);

    expect(response.body).toHaveProperty("id", mockDepartmentId);
    expect(response.body).toHaveProperty("name", "Engineering");
  });

  it("updates a department", async () => {
    const response = await request(
      createApp({
        departmentService: readyDepartmentService,
      }),
    )
      .put(`/api/v1/departments/${mockDepartmentId}`)
      .send({
        name: "Engineering & Research",
        description: "Updated description",
      })
      .expect(200);

    expect(response.body).toHaveProperty("name", "Engineering & Research");
    expect(response.body).toHaveProperty("description", "Updated description");
  });

  it("deletes a department", async () => {
    await request(
      createApp({
        departmentService: readyDepartmentService,
      }),
    )
      .delete(`/api/v1/departments/${mockDepartmentId}`)
      .expect(204);
  });

  it("returns 404 for non-existent department", async () => {
    await request(
      createApp({
        departmentService: readyDepartmentService,
      }),
    )
      .get(`/api/v1/departments/999e4567-e89b-12d3-a456-426614174999`)
      .expect(404);
  });
});
