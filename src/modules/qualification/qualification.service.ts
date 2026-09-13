import { AppError } from "../../shared/errors/app-error.js";
import type {
  CreateQualificationInput,
  Qualification,
  QualificationRepository,
  UpdateQualificationInput,
} from "./qualification.types.js";
import { qualificationRepository } from "./qualification.repository.js";

/*
 * خدمة المؤهلات (Qualification Service)
 * تحتوي على منطق العمل (Business Logic)
 * تتعامل مع المستودع (Repository) وتطبق قواعد العمل
 */
export class QualificationService {
  constructor(
    private readonly repository: QualificationRepository = qualificationRepository,
  ) {}

  /*
   * جلب جميع المؤهلات
   */
  async getAll(): Promise<Qualification[]> {
    return this.repository.findAll();
  }

  /*
   * جلب مؤهل بواسطة المعرف
   * يرمي خطأ إذا لم يتم العثور على المؤهل
   */
  async getById(id: string): Promise<Qualification> {
    const qualification = await this.repository.findById(id);
    if (!qualification) {
      throw new AppError({
        message: "المؤهل المطلوب غير موجود",
        code: "QUALIFICATION_NOT_FOUND",
        statusCode: 404,
      });
    }
    return qualification;
  }

  /*
   * إنشاء مؤهل جديد
   * منطق العمل: التحقق من عدم تكرار الاسم داخل نفس المنظمة يتم على مستوى قاعدة البيانات (Unique Constraint)
   */
  async create(input: CreateQualificationInput): Promise<Qualification> {
    return this.repository.create(input);
  }

  /*
   * تحديث مؤهل موجود
   * أولاً نتحقق من وجود المؤهل، ثم نقوم بالتحديث
   */
  async update(
    id: string,
    input: UpdateQualificationInput,
  ): Promise<Qualification> {
    // التحقق من وجود المؤهل قبل التحديث
    await this.getById(id);

    const updated = await this.repository.update(id, input);
    if (!updated) {
      throw new AppError({
        message: "فشل تحديث المؤهل",
        code: "UPDATE_FAILED",
        statusCode: 500,
      });
    }
    return updated;
  }

  /*
   * حذف مؤهل
   * التحقق من وجود المؤهل قبل الحذف
   */
  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.remove(id);
  }
}

/*
 * تصدير نسخة واحدة (Singleton) للاستخدام في الكونترولر
 */
export const qualificationService = new QualificationService();