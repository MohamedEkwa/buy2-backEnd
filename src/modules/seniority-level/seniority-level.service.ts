import { AppError } from "../../shared/errors/app-error.js";
import type {
  CreateSeniorityLevelInput,
  SeniorityLevel,
  SeniorityLevelRepository,
  UpdateSeniorityLevelInput,
} from "./seniority-level.types.js";
import { seniorityLevelRepository } from "./seniority-level.repository.js";

/*
 * خدمة المستويات الوظيفية (SeniorityLevel Service)
 * تحتوي على منطق العمل (Business Logic)
 * تتعامل مع المستودع (Repository) وتطبق قواعد العمل
 */
export class SeniorityLevelService {
  constructor(
    private readonly repository: SeniorityLevelRepository = seniorityLevelRepository,
  ) {}

  /*
   * جلب جميع المستويات الوظيفية
   */
  async getAll(): Promise<SeniorityLevel[]> {
    return this.repository.findAll();
  }

  /*
   * جلب مستوى وظيفي بواسطة المعرف
   * يرمي خطأ إذا لم يتم العثور على المستوى
   */
  async getById(id: string): Promise<SeniorityLevel> {
    const level = await this.repository.findById(id);
    if (!level) {
      throw new AppError({
        message: "المستوى الوظيفي المطلوب غير موجود",
        code: "SENIORITY_LEVEL_NOT_FOUND",
        statusCode: 404,
      });
    }
    return level;
  }

  /*
   * إنشاء مستوى وظيفي جديد
   * منطق العمل: التحقق من عدم تكرار الاسم أو الترتيب داخل نفس المنظمة يتم على مستوى قاعدة البيانات (Unique Constraint)
   */
  async create(input: CreateSeniorityLevelInput): Promise<SeniorityLevel> {
    return this.repository.create(input);
  }

  /*
   * تحديث مستوى وظيفي موجود
   * أولاً نتحقق من وجود المستوى، ثم نقوم بالتحديث
   */
  async update(
    id: string,
    input: UpdateSeniorityLevelInput,
  ): Promise<SeniorityLevel> {
    // التحقق من وجود المستوى قبل التحديث
    await this.getById(id);

    const updated = await this.repository.update(id, input);
    if (!updated) {
      throw new AppError({
        message: "فشل تحديث المستوى الوظيفي",
        code: "UPDATE_FAILED",
        statusCode: 500,
      });
    }
    return updated;
  }

  /*
   * حذف مستوى وظيفي
   * التحقق من وجود المستوى قبل الحذف
   */
  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.remove(id);
  }
}

/*
 * تصدير نسخة واحدة (Singleton) للاستخدام في الكونترولر
 */
export const seniorityLevelService = new SeniorityLevelService();