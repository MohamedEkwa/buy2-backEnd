import { Router } from "express";
import { defineRoute } from "../../shared/http/define-route.js";
import { uuidParamsSchema } from "../../shared/http/schemas.js";
import {
  OrganizationController,
  organizationController,
} from "./organization.controller.js";
import {
  CreateOrganizationSchema,
  UpdateOrganizationSchema,
  OrganizationResponseSchema,
} from "./organization.schema.js";
import { z } from "zod";

/*
 * بناء راوتر المنظمات (Organization Router)
 * يحدد مسارات API وتوثيق OpenAPI والتحقق من صحة المدخلات
 */
function buildOrganizationRouter(dependencies?: { organizationService?: any }) {
  const router = Router();
  const controller = dependencies?.organizationService
    ? new OrganizationController(dependencies.organizationService)
    : organizationController;

  // 1. مسار جلب جميع المنظمات
  defineRoute(router, {
    method: "get",
    path: "/",
    openapiPath: "/organizations",
    summary: "Get all organizations",
    operationId: "getOrganizations",
    tags: ["Organizations"],
    responses: {
      200: {
        description: "List of organizations",
        schema: z.array(OrganizationResponseSchema),
      },
    },
    handler: controller.getAll,
  });

  // 2. مسار جلب منظمة بواسطة المعرف (ID)
  defineRoute(router, {
    method: "get",
    path: "/:id",
    openapiPath: "/organizations/{id}",
    summary: "Get an organization by ID",
    operationId: "getOrganizationById",
    tags: ["Organizations"],
    request: {
      params: uuidParamsSchema,
    },
    responses: {
      200: {
        description: "Organization found",
        schema: OrganizationResponseSchema,
      },
    },
    handler: controller.getById,
  });

  // 3. مسار جلب منظمة بواسطة الـ Slug
  defineRoute(router, {
    method: "get",
    path: "/slug/:slug",
    openapiPath: "/organizations/slug/{slug}",
    summary: "Get an organization by Slug",
    operationId: "getOrganizationBySlug",
    tags: ["Organizations"],
    request: {
      params: z.object({
        slug: z.string().min(1).describe("Organization slug identifier"),
      }),
    },
    responses: {
      200: {
        description: "Organization found",
        schema: OrganizationResponseSchema,
      },
    },
    handler: controller.getBySlug,
  });

  // 4. مسار إنشاء منظمة جديدة
  defineRoute(router, {
    method: "post",
    path: "/",
    openapiPath: "/organizations",
    summary: "Create a new organization",
    operationId: "createOrganization",
    tags: ["Organizations"],
    request: {
      body: CreateOrganizationSchema,
    },
    responses: {
      201: {
        description: "Organization created successfully",
        schema: OrganizationResponseSchema,
      },
    },
    handler: controller.create,
  });

  // 5. مسار تعديل منظمة
  defineRoute(router, {
    method: "put",
    path: "/:id",
    openapiPath: "/organizations/{id}",
    summary: "Update an existing organization",
    operationId: "updateOrganization",
    tags: ["Organizations"],
    request: {
      params: uuidParamsSchema,
      body: UpdateOrganizationSchema,
    },
    responses: {
      200: {
        description: "Organization updated successfully",
        schema: OrganizationResponseSchema,
      },
    },
    handler: controller.update,
  });

  // 6. مسار حذف منظمة
  defineRoute(router, {
    method: "delete",
    path: "/:id",
    openapiPath: "/organizations/{id}",
    summary: "Delete an organization",
    operationId: "deleteOrganization",
    tags: ["Organizations"],
    request: {
      params: uuidParamsSchema,
    },
    responses: {
      204: {
        description: "Organization deleted successfully",
      },
    },
    handler: controller.delete,
  });

  return router;
}

/*
 * تصدير الراوتر الجاهز للاستخدام، ودالة البناء للاختبارات
 */
export default buildOrganizationRouter();
export { buildOrganizationRouter as createOrganizationRouter };