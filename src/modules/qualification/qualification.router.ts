import { Router } from "express";
import { defineRoute } from "../../shared/http/define-route.js";
import { uuidParamsSchema } from "../../shared/http/schemas.js";
import {
  QualificationController,
  qualificationController,
} from "./qualification.controller.js";
import {
  CreateQualificationSchema,
  UpdateQualificationSchema,
  QualificationResponseSchema,
} from "./qualification.schema.js";
import { z } from "zod";

/*
 * بناء راوتر المؤهلات (Qualification Router)
 * يحدد مسارات API وتوثيق OpenAPI والتحقق من صحة المدخلات
 */
function buildQualificationRouter(dependencies?: { qualificationService?: any }) {
  const router = Router();
  const controller = dependencies?.qualificationService
    ? new QualificationController(dependencies.qualificationService)
    : qualificationController;

  // 1. مسار جلب جميع المؤهلات
  defineRoute(router, {
    method: "get",
    path: "/",
    openapiPath: "/qualifications",
    summary: "Get all qualifications",
    operationId: "getQualifications",
    tags: ["Qualifications"],
    responses: {
      200: {
        description: "List of qualifications",
        schema: z.array(QualificationResponseSchema),
      },
    },
    handler: controller.getAll,
  });

  // 2. مسار جلب مؤهل بواسطة المعرف (ID)
  defineRoute(router, {
    method: "get",
    path: "/:id",
    openapiPath: "/qualifications/{id}",
    summary: "Get a qualification by ID",
    operationId: "getQualificationById",
    tags: ["Qualifications"],
    request: {
      params: uuidParamsSchema,
    },
    responses: {
      200: {
        description: "Qualification found",
        schema: QualificationResponseSchema,
      },
    },
    handler: controller.getById,
  });

  // 3. مسار إنشاء مؤهل جديد
  defineRoute(router, {
    method: "post",
    path: "/",
    openapiPath: "/qualifications",
    summary: "Create a new qualification",
    operationId: "createQualification",
    tags: ["Qualifications"],
    request: {
      body: CreateQualificationSchema,
    },
    responses: {
      201: {
        description: "Qualification created successfully",
        schema: QualificationResponseSchema,
      },
    },
    handler: controller.create,
  });

  // 4. مسار تعديل مؤهل
  defineRoute(router, {
    method: "put",
    path: "/:id",
    openapiPath: "/qualifications/{id}",
    summary: "Update an existing qualification",
    operationId: "updateQualification",
    tags: ["Qualifications"],
    request: {
      params: uuidParamsSchema,
      body: UpdateQualificationSchema,
    },
    responses: {
      200: {
        description: "Qualification updated successfully",
        schema: QualificationResponseSchema,
      },
    },
    handler: controller.update,
  });

  // 5. مسار حذف مؤهل
  defineRoute(router, {
    method: "delete",
    path: "/:id",
    openapiPath: "/qualifications/{id}",
    summary: "Delete a qualification",
    operationId: "deleteQualification",
    tags: ["Qualifications"],
    request: {
      params: uuidParamsSchema,
    },
    responses: {
      204: {
        description: "Qualification deleted successfully",
      },
    },
    handler: controller.delete,
  });

  return router;
}

/*
 * تصدير الراوتر الجاهز للاستخدام، ودالة البناء للاختبارات
 */
export default buildQualificationRouter();
export { buildQualificationRouter as createQualificationRouter };