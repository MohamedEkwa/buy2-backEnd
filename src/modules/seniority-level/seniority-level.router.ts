import { Router } from "express";
import { defineRoute } from "../../shared/http/define-route.js";
import { uuidParamsSchema } from "../../shared/http/schemas.js";
import {
  SeniorityLevelController,
  seniorityLevelController,
} from "./seniority-level.controller.js";
import {
  CreateSeniorityLevelSchema,
  UpdateSeniorityLevelSchema,
  SeniorityLevelResponseSchema,
} from "./seniority-level.schema.js";
import { z } from "zod";

/*
 * بناء راوتر المستويات الوظيفية (SeniorityLevel Router)
 * يحدد مسارات API وتوثيق OpenAPI والتحقق من صحة المدخلات
 */
function buildSeniorityLevelRouter(dependencies?: { seniorityLevelService?: any }) {
  const router = Router();
  const controller = dependencies?.seniorityLevelService
    ? new SeniorityLevelController(dependencies.seniorityLevelService)
    : seniorityLevelController;

  // 1. مسار جلب جميع المستويات الوظيفية
  defineRoute(router, {
    method: "get",
    path: "/",
    openapiPath: "/seniority-levels",
    summary: "Get all seniority levels",
    operationId: "getSeniorityLevels",
    tags: ["Seniority Levels"],
    responses: {
      200: {
        description: "List of seniority levels",
        schema: z.array(SeniorityLevelResponseSchema),
      },
    },
    handler: controller.getAll,
  });

  // 2. مسار جلب مستوى وظيفي بواسطة المعرف (ID)
  defineRoute(router, {
    method: "get",
    path: "/:id",
    openapiPath: "/seniority-levels/{id}",
    summary: "Get a seniority level by ID",
    operationId: "getSeniorityLevelById",
    tags: ["Seniority Levels"],
    request: {
      params: uuidParamsSchema,
    },
    responses: {
      200: {
        description: "Seniority level found",
        schema: SeniorityLevelResponseSchema,
      },
    },
    handler: controller.getById,
  });

  // 3. مسار إنشاء مستوى وظيفي جديد
  defineRoute(router, {
    method: "post",
    path: "/",
    openapiPath: "/seniority-levels",
    summary: "Create a new seniority level",
    operationId: "createSeniorityLevel",
    tags: ["Seniority Levels"],
    request: {
      body: CreateSeniorityLevelSchema,
    },
    responses: {
      201: {
        description: "Seniority level created successfully",
        schema: SeniorityLevelResponseSchema,
      },
    },
    handler: controller.create,
  });

  // 4. مسار تعديل مستوى وظيفي
  defineRoute(router, {
    method: "put",
    path: "/:id",
    openapiPath: "/seniority-levels/{id}",
    summary: "Update an existing seniority level",
    operationId: "updateSeniorityLevel",
    tags: ["Seniority Levels"],
    request: {
      params: uuidParamsSchema,
      body: UpdateSeniorityLevelSchema,
    },
    responses: {
      200: {
        description: "Seniority level updated successfully",
        schema: SeniorityLevelResponseSchema,
      },
    },
    handler: controller.update,
  });

  // 5. مسار حذف مستوى وظيفي
  defineRoute(router, {
    method: "delete",
    path: "/:id",
    openapiPath: "/seniority-levels/{id}",
    summary: "Delete a seniority level",
    operationId: "deleteSeniorityLevel",
    tags: ["Seniority Levels"],
    request: {
      params: uuidParamsSchema,
    },
    responses: {
      204: {
        description: "Seniority level deleted successfully",
      },
    },
    handler: controller.delete,
  });

  return router;
}

/*
 * تصدير الراوتر الجاهز للاستخدام، ودالة البناء للاختبارات
 */
export default buildSeniorityLevelRouter();
export { buildSeniorityLevelRouter as createSeniorityLevelRouter };