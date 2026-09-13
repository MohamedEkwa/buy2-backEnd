import type { Request, Response, NextFunction, RequestHandler } from "express";
import { organizationService } from "./organization.service.js";
import type { OrganizationService as OrganizationServiceType } from "./organization.service.js";
import type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from "./organization.types.js";
import { AppError } from "../../shared/errors/app-error.js";

/*
 * متحكم المنظمات (Organization Controller)
 * مسؤول عن التعامل مع طلبات HTTP واستجابات Express
 * يفصل طبقة النقل (HTTP) عن منطق العمل (Service)
 */
export class OrganizationController {
  constructor(
    private readonly service: OrganizationServiceType = organizationService,
  ) {}

  /*
   * دالة مساعدة لاستخلاص معرف نصي نقي من المعاملات
   * تتعامل مع حالات تعبيرات المسار المعقدة
   */
  private getCleanId(paramId: string | string[] | undefined): string {
    if (!paramId || typeof paramId !== "string") {
      throw new AppError({
        message: "معرف غير صالح أو مفقود",
        code: "INVALID_ID",
        statusCode: 400,
      });
    }
    return paramId;
  }

  /*
   * GET /api/v1/organizations
   * جلب جميع المنظمات
   */
  getAll: RequestHandler = async (req, res, next) => {
    try {
      const organizations = await this.service.getAll();
      res.status(200).json(organizations);
    } catch (error) {
      next(error);
    }
  };

  /*
   * GET /api/v1/organizations/:id
   * جلب منظمة محددة بواسطة المعرف
   */
  getById: RequestHandler = async (req, res, next) => {
    try {
      const cleanId = this.getCleanId(req.params.id);
      const organization = await this.service.getById(cleanId);
      res.status(200).json(organization);
    } catch (error) {
      next(error);
    }
  };

  /*
   * GET /api/v1/organizations/slug/:slug
   * جلب منظمة بواسطة المعرف المختصر (Slug)
   */
  getBySlug: RequestHandler = async (req, res, next) => {
    try {
      const slug = req.params.slug;
      if (!slug || typeof slug !== "string") {
        throw new AppError({
          message: "المعرف المختصر (Slug) غير صالح أو مفقود",
          code: "INVALID_SLUG",
          statusCode: 400,
        });
      }
      const organization = await this.service.getBySlug(slug);
      if (!organization) {
        throw new AppError({
          message: "المنظمة المطلوبة غير موجودة",
          code: "ORGANIZATION_NOT_FOUND",
          statusCode: 404,
        });
      }
      res.status(200).json(organization);
    } catch (error) {
      next(error);
    }
  };

  /*
   * POST /api/v1/organizations
   * إنشاء منظمة جديدة
   * البيانات المدققة متاحة في (req as any).validated.body
   */
  create: RequestHandler = async (req, res, next) => {
    try {
      const payload = (req as any).validated?.body as CreateOrganizationInput;
      const organization = await this.service.create(payload);
      res.status(201).json(organization);
    } catch (error) {
      next(error);
    }
  };

  /*
   * PUT /api/v1/organizations/:id
   * تحديث منظمة موجودة
   */
  update: RequestHandler = async (req, res, next) => {
    try {
      const cleanId = this.getCleanId(req.params.id);
      const payload = (req as any).validated?.body as UpdateOrganizationInput;
      const organization = await this.service.update(cleanId, payload);
      res.status(200).json(organization);
    } catch (error) {
      next(error);
    }
  };

  /*
   * DELETE /api/v1/organizations/:id
   * حذف منظمة
   * تحذير: هذا سيحذف كل البيانات المرتبطة (Cascade Delete)
   */
  delete: RequestHandler = async (req, res, next) => {
    try {
      const cleanId = this.getCleanId(req.params.id);
      await this.service.remove(cleanId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

/*
 * تصدير نسخة واحدة (Singleton) للاستخدام في الراوتر
 */
export const organizationController = new OrganizationController();