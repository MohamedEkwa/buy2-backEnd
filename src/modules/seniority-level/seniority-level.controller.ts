import type { Request, Response, NextFunction, RequestHandler } from "express";
import { seniorityLevelService } from "./seniority-level.service.js";
import type { SeniorityLevelService as SeniorityLevelServiceType } from "./seniority-level.service.js";
import type {
  CreateSeniorityLevelInput,
  UpdateSeniorityLevelInput,
} from "./seniority-level.types.js";
import { AppError } from "../../shared/errors/app-error.js";

/*
 * متحكم المستويات الوظيفية (SeniorityLevel Controller)
 * مسؤول عن التعامل مع طلبات HTTP واستجابات Express
 * يفصل طبقة النقل (HTTP) عن منطق العمل (Service)
 */
export class SeniorityLevelController {
  constructor(
    private readonly service: SeniorityLevelServiceType = seniorityLevelService,
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
   * GET /api/v1/seniority-levels
   * جلب جميع المستويات الوظيفية
   */
  getAll: RequestHandler = async (req, res, next) => {
    try {
      const levels = await this.service.getAll();
      res.status(200).json(levels);
    } catch (error) {
      next(error);
    }
  };

  /*
   * GET /api/v1/seniority-levels/:id
   * جلب مستوى وظيفي محدد بواسطة المعرف
   */
  getById: RequestHandler = async (req, res, next) => {
    try {
      const cleanId = this.getCleanId(req.params.id);
      const level = await this.service.getById(cleanId);
      res.status(200).json(level);
    } catch (error) {
      next(error);
    }
  };

  /*
   * POST /api/v1/seniority-levels
   * إنشاء مستوى وظيفي جديد
   * البيانات المدققة متاحة في (req as any).validated.body
   */
  create: RequestHandler = async (req, res, next) => {
    try {
      const payload = (req as any).validated?.body as CreateSeniorityLevelInput;
      const level = await this.service.create(payload);
      res.status(201).json(level);
    } catch (error) {
      next(error);
    }
  };

  /*
   * PUT /api/v1/seniority-levels/:id
   * تحديث مستوى وظيفي موجود
   */
  update: RequestHandler = async (req, res, next) => {
    try {
      const cleanId = this.getCleanId(req.params.id);
      const payload = (req as any).validated?.body as UpdateSeniorityLevelInput;
      const level = await this.service.update(cleanId, payload);
      res.status(200).json(level);
    } catch (error) {
      next(error);
    }
  };

  /*
   * DELETE /api/v1/seniority-levels/:id
   * حذف مستوى وظيفي
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
export const seniorityLevelController = new SeniorityLevelController();