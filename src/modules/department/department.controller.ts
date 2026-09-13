import type { Request, Response, NextFunction, RequestHandler } from "express";
import { departmentService } from "./department.service.js";
import type { DepartmentService as DepartmentServiceType } from "./department.service.js";
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "./department.types.js";
import { AppError } from "../../shared/errors/app-error.js";

/*
 * متحكم الأقسام (Department Controller)
 * مسؤول عن التعامل مع طلبات HTTP واستجابات Express
 * يفصل طبقة النقل (HTTP) عن منطق العمل (Service)
 */
export class DepartmentController {
  constructor(
    private readonly service: DepartmentServiceType = departmentService,
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
        status: 400,
      } as any);
    }
    return paramId;
  }

  /*
   * GET /api/v1/departments
   * جلب جميع الأقسام
   */
  getAll: RequestHandler = async (req, res, next) => {
    try {
      const departments = await this.service.getAll();
      res.status(200).json(departments);
    } catch (error) {
      next(error);
    }
  };

  /*
   * GET /api/v1/departments/:id
   * جلب قسم محدد بواسطة المعرف
   */
  getById: RequestHandler = async (req, res, next) => {
    try {
      const cleanId = this.getCleanId(req.params.id);
      const department = await this.service.getById(cleanId);
      res.status(200).json(department);
    } catch (error) {
      next(error);
    }
  };

  /*
   * POST /api/v1/departments
   * إنشاء قسم جديد
   * البيانات المدققة متاحة في (req as any).validated.body
   */
  create: RequestHandler = async (req, res, next) => {
    try {
      const payload = (req as any).validated?.body as CreateDepartmentInput;
      const department = await this.service.create(payload);
      res.status(201).json(department);
    } catch (error) {
      next(error);
    }
  };

  /*
   * PUT /api/v1/departments/:id
   * تحديث قسم موجود
   */
  update: RequestHandler = async (req, res, next) => {
    try {
      const cleanId = this.getCleanId(req.params.id);
      const payload = (req as any).validated?.body as UpdateDepartmentInput;
      const department = await this.service.update(cleanId, payload);
      res.status(200).json(department);
    } catch (error) {
      next(error);
    }
  };

  /*
   * DELETE /api/v1/departments/:id
   * حذف قسم
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
export const departmentController = new DepartmentController();