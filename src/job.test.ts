import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import type {
  JobPositionService,
  JobPosition,
} from "./modules/job/job.types.js";

const mockDepartmentId = "d3b07384-d113-40a2-a3a4-e9106093153a";
const mockSeniorityLevelId = "e4c18495-e224-51b3-b4b5-f0107104264b";
const mockJobPositionId = "f5d295a6-f335-62c4-c5c6-01208215375c";

const mockJobPosition: JobPosition = {
  id: mockJobPositionId,
  departmentId: mockDepartmentId,
  seniorityLevelId: mockSeniorityLevelId,
  managerJobPositionId: null,
  title: "Software Engineer",
  description: "Build and maintain backend services.",
  isActive: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const readyHealthService = {
  checkHealth: async () => ({ status: "UP" }),
};

const readyJobService: JobPositionService = {
  getAll: async () => [mockJobPosition],
  getById: async (id: string) => {
    if (id !== mockJobPositionId) return null;
    return mockJobPosition;
  },
  create: async (input) => ({
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    ...input,
    isActive: input.isActive ?? true,
    createdAt: new Date("2026-08-22T00:00:00.000Z"),
    updatedAt: new Date("2026-08-22T00:00:00.000Z"),
  }),
  update: async (id, input) => {
    if (id !== mockJobPositionId) return null;
    return {
      ...mockJobPosition,
      ...input,
      updatedAt: new Date("2026-08-22T00:00:00.000Z"),
    };
  },
  remove: async (id: string) => undefined,
};

describe("Job Position API", () => {
  it("returns all job positions", async () => {
    const response = await request(
      createApp({
        jobService: readyJobService,
      }),
    )
      .get("/api/v1/jobs")
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("title", "Software Engineer");
    expect(response.body[0]).toHaveProperty("departmentId", mockDepartmentId);
  });

  it("creates a new job position", async () => {
    const response = await request(
      createApp({
        jobService: readyJobService,
      }),
    )
      .post("/api/v1/jobs")
      .send({
        title: "Product Manager",
        description: "Own product roadmap and requirements.",
        departmentId: mockDepartmentId,
        seniorityLevelId: mockSeniorityLevelId,
      })
      .expect(201);

    expect(response.body).toHaveProperty("title", "Product Manager");
    expect(response.body).toHaveProperty("id");
  });

  it("returns a job position by id", async () => {
    const response = await request(
      createApp({
        jobService: readyJobService,
      }),
    )
      .get(`/api/v1/jobs/${mockJobPositionId}`)
      .expect(200);

    expect(response.body).toHaveProperty("id", mockJobPositionId);
    expect(response.body).toHaveProperty("title", "Software Engineer");
  });
});
