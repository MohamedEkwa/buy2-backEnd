import { Router } from "express";
import { defineRoute } from "../../shared/http/define-route.js";
import { uuidParamsSchema } from "../../shared/http/schemas.js";
import {
  DepartmentController,
  departmentController,
} from "./department.controller.js";
import {
  CreateDepartmentSchema,
  UpdateDepartmentSchema,
  DepartmentResponseSchema,
} from "./department.schema.js";
import { z } from "zod";

/*
 * بناء راوتر الأقسام (Department Router)
 * يحدد مسارات API وتوثيق OpenAPI والتحقق من صحة المدخلات
 */
function buildDepartmentRouter(dependencies?: { departmentService?: any }) {
  const router = Router();
  const controller = dependencies?.departmentService
    ? new DepartmentController(dependencies.departmentService)
    : departmentController;

  // 1. مسار جلب جميع الأقسام
  defineRoute(router, {
    method: "get",
    path: "/",
    openapiPath: "/departments",
    summary: "Get all departments",
    operationId: "getDepartments",
    tags: ["Departments"],
    responses: {
      200: {
        description: "List of departments",
        schema: z.array(DepartmentResponseSchema),
      },
    },
    handler: controller.getAll,
  });

  // 2. مسار جلب قسم بواسطة المعرف (ID)
  defineRoute(router, {
    method: "get",
    path: "/:id",
    openapiPath: "/departments/{id}",
    summary: "Get a department by ID",
    operationId: "getDepartmentById",
    tags: ["Departments"],
    request: {
      params: uuidParamsSchema,
    },
    responses: {
      200: {
        description: "Department found",
        schema: DepartmentResponseSchema,
      },
    },
    handler: controller.getById,
  });

  // 3. مسار إنشاء قسم جديد
  defineRoute(router, {
    method: "post",
    path: "/",
    openapiPath: "/departments",
    summary: "Create a new department",
    operationId: "createDepartment",
    tags: ["Departments"],
    request: {
      body: CreateDepartmentSchema,
    },
    responses: {
      201: {
        description: "Department created successfully",
        schema: DepartmentResponseSchema,
      },
    },
    handler: controller.create,
  });

  // 4. مسار تعديل قسم
  defineRoute(router, {
    method: "put",
    path: "/:id",
    openapiPath: "/departments/{id}",
    summary: "Update an existing department",
    operationId: "updateDepartment",
    tags: ["Departments"],
    request: {
      params: uuidParamsSchema,
      body: UpdateDepartmentSchema,
    },
    responses: {
      200: {
        description: "Department updated successfully",
        schema: DepartmentResponseSchema,
      },
    },
    handler: controller.update,
  });

  // 5. مسار حذف قسم
  defineRoute(router, {
    method: "delete",
    path: "/:id",
    openapiPath: "/departments/{id}",
    summary: "Delete a department",
    operationId: "deleteDepartment",
    tags: ["Departments"],
    request: {
      params: uuidParamsSchema,
    },
    responses: {
      204: {
        description: "Department deleted successfully",
      },
    },
    handler: controller.delete,
  });

  return router;
}

/*
 * تصدير الراوتر الجاهز للاستخدام، ودالة البناء للاختبارات
 */
export default buildDepartmentRouter();
export { buildDepartmentRouter as createDepartmentRouter };