import { Router } from "express";
import { defineRoute } from "../../shared/http/define-route.js";
import { uuidParamsSchema } from "../../shared/http/schemas.js";
import {
  JobPositionController,
  jobPositionController,
} from "./job.controller.js";
import {
  CreateJobPositionSchema,
  UpdateJobPositionSchema,
  JobPositionResponseSchema,
} from "./job.schema.js";
import { z } from "zod";

function buildJobRouter(dependencies?: { jobService?: any }) {
  const router = Router();
  const controller = dependencies?.jobService
    ? new JobPositionController(dependencies.jobService)
    : jobPositionController;

  // 1. مسار جلب جميع المناصب الوظيفية
  defineRoute(router, {
    method: "get",
    path: "/",
    openapiPath: "/jobs",
    summary: "Get all job positions",
    operationId: "getJobPositions",
    tags: ["Job Positions"],
    responses: {
      200: {
        description: "List of job positions",
        schema: z.array(JobPositionResponseSchema),
      },
    },
    handler: controller.getAll,
  });

  // 2. مسار جلب منصب وظيفي حسب المعرف (ID)
  defineRoute(router, {
    method: "get",
    path: "/:id",
    openapiPath: "/jobs/{id}",
    summary: "Get a job position by ID",
    operationId: "getJobPositionById",
    tags: ["Job Positions"],
    request: {
      params: uuidParamsSchema,
    },
    responses: {
      200: {
        description: "Job position found",
        schema: JobPositionResponseSchema,
      },
    },
    handler: controller.getById,
  });

  // 3. مسار إنشاء منصب وظيفي جديد
  defineRoute(router, {
    method: "post",
    path: "/",
    openapiPath: "/jobs",
    summary: "Create a new job position",
    operationId: "createJobPosition",
    tags: ["Job Positions"],
    request: {
      body: CreateJobPositionSchema,
    },
    responses: {
      201: {
        description: "Job position created successfully",
        schema: JobPositionResponseSchema,
      },
    },
    handler: controller.create,
  });

  // 4. مسار تعديل منصب وظيفي
  defineRoute(router, {
    method: "put",
    path: "/:id",
    openapiPath: "/jobs/{id}",
    summary: "Update an existing job position",
    operationId: "updateJobPosition",
    tags: ["Job Positions"],
    request: {
      params: uuidParamsSchema,
      body: UpdateJobPositionSchema,
    },
    responses: {
      200: {
        description: "Job position updated successfully",
        schema: JobPositionResponseSchema,
      },
    },
    handler: controller.update,
  });

  // 5. مسار حذف منصب وظيفي
  defineRoute(router, {
    method: "delete",
    path: "/:id",
    openapiPath: "/jobs/{id}",
    summary: "Delete a job position",
    operationId: "deleteJobPosition",
    tags: ["Job Positions"],
    request: {
      params: uuidParamsSchema,
    },
    responses: {
      204: {
        description: "Job position deleted successfully",
      },
    },
    handler: controller.delete,
  });
  return router;
}

export default buildJobRouter();
export { buildJobRouter as createJobRouter };
