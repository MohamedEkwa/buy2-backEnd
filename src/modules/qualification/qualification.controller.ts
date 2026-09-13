import type { Request, Response, NextFunction, RequestHandler } from "express";
import { qualificationService } from "./qualification.service.js";
import type { QualificationService as QualificationServiceType } from "./qualification.service.js";
import type {
  CreateQualificationInput,
  UpdateQualificationInput,
} from "./qualification.types.js";
import { AppError } from "../../shared/errors/app-error.js";

/*
 * متحكم المؤهلات (Qualification Controller)
 * مسؤول عن التعامل مع طلبات HTTP واستجابات Express
 * يفصل طبقة النقل (HTTP) عن منطق العمل (Service)
 */
export class QualificationController {
  constructor(
    private readonly service: QualificationServiceType = qualificationService,
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
   * GET /api/v1/qualifications
   * جلب جميع المؤهلات
   */
  getAll: RequestHandler = async (req, res, next) => {
    try {
      const qualifications = await this.service.getAll();
      res.status(200).json(qualifications);
    } catch (error) {
      next(error);
    }
  };

  /*
   * GET /api/v1/qualifications/:id
   * جلب مؤهل محدد بواسطة المعرف
   */
  getById: RequestHandler = async (req, res, next) => {
    try {
      const cleanId = this.getCleanId(req.params.id);
      const qualification = await this.service.getById(cleanId);
      res.status(200).json(qualification);
    } catch (error) {
      next(error);
    }
  };

  /*
   * POST /api/v1/qualifications
   * إنشاء مؤهل جديد
   * البيانات المدققة متاحة في (req as any).validated.body
   */
  create: RequestHandler = async (req, res, next) => {
    try {
      const payload = (req as any).validated?.body as CreateQualificationInput;
      const qualification = await this.service.create(payload);
      res.status(201).json(qualification);
    } catch (error) {
      next(error);
    }
  };

  /*
   * PUT /api/v1/qualifications/:id
   * تحديث مؤهل موجود
   */
  update: RequestHandler = async (req, res, next) => {
    try {
      const cleanId = this.getCleanId(req.params.id);
      const payload = (req as any).validated?.body as UpdateQualificationInput;
      const qualification = await this.service.update(cleanId, payload);
      res.status(200).json(qualification);
    } catch (error) {
      next(error);
    }
  };

  /*
   * DELETE /api/v1/qualifications/:id
   * حذف مؤهل
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
export const qualificationController = new QualificationController();