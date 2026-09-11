import { Router } from "express";
import { defineRoute } from "../../shared/http/define-route.js"; // [1]
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

  // 1. مسار جلب الكل
  defineRoute(router, {
    method: "get",
    path: "/",
    summary: "Get all job positions",
    operationId: "getJobPositions", // 💡 إجباري لتغذية الـ OpenAPI
    tags: ["Job Positions"], // 💡 إجباري لتصنيف الـ Swagger
    responses: {
      200: {
        description: "List of job positions",
        schema: z.array(JobPositionResponseSchema), // 💡 استخدام schema مباشرة
      },
    },
    handler: controller.getAll,
  });

  // 2. مسار جلب معرف محدد
  defineRoute(router, {
    method: "get",
    path: "/:id",
    summary: "Get a job position by ID",
    operationId: "getJobPositionById",
    tags: ["Job Positions"],
    responses: {
      200: {
        description: "Job position found",
        schema: JobPositionResponseSchema, // 💡 استخدام schema مباشرة
      },
    },
    handler: controller.getById,
  });

  // 3. مسار إنشاء وظيفة جديدة
  defineRoute(router, {
    method: "post",
    path: "/",
    summary: "Create a new job position",
    operationId: "createJobPosition",
    tags: ["Job Positions"],
    request: {
      body: CreateJobPositionSchema, // 💡 تمرير الـ Schema لـ body مباشرة بدون content
    },
    responses: {
      201: {
        description: "Job position created successfully",
        schema: JobPositionResponseSchema,
      },
    },
    handler: controller.create,
  });

  // 4. مسار تعديل وظيفة
  defineRoute(router, {
    method: "put",
    path: "/:id",
    summary: "Update an existing job position",
    operationId: "updateJobPosition",
    tags: ["Job Positions"],
    request: {
      body: UpdateJobPositionSchema, // 💡 تمرير الـ Schema لـ body مباشرة بدون content
    },
    responses: {
      200: {
        description: "Job position updated successfully",
        schema: JobPositionResponseSchema,
      },
    },
    handler: controller.update,
  });

  // 5. مسار الحذف
  defineRoute(router, {
    method: "delete",
    path: "/:id",
    summary: "Delete a job position",
    operationId: "deleteJobPosition",
    tags: ["Job Positions"],
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
