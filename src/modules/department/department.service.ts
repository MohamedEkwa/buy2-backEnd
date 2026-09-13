import { AppError } from "../../shared/errors/app-error.js";
import type {
  CreateDepartmentInput,
  Department,
  DepartmentRepository,
  UpdateDepartmentInput,
} from "./department.types.js";
import { departmentRepository } from "./department.repository.js";

/*
 * خدمة الأقسام (Department Service)
 * تحتوي على منطق العمل (Business Logic)
 * تتعامل مع المستودع (Repository) وتطبق قواعد العمل
 */
export class DepartmentService {
  constructor(
    private readonly repository: DepartmentRepository = departmentRepository,
  ) {}

  /*
   * جلب جميع الأقسام
   */
  async getAll(): Promise<Department[]> {
    return this.repository.findAll();
  }

  /*
   * جلب قسم بواسطة المعرف
   * يرمي خطأ إذا لم يتم العثور على القسم
   */
  async getById(id: string): Promise<Department> {
    const department = await this.repository.findById(id);
    if (!department) {
      throw new AppError({
        message: "القسم المطلوب غير موجود",
        code: "DEPARTMENT_NOT_FOUND",
        statusCode: 404,
      });
    }
    return department;
  }

  /*
   * إنشاء قسم جديد
   * منطق العمل: التحقق من عدم تكرار الاسم داخل نفس المنظمة يتم على مستوى قاعدة البيانات (Unique Constraint)
   */
  async create(input: CreateDepartmentInput): Promise<Department> {
    return this.repository.create(input);
  }

  /*
   * تحديث قسم موجود
   * أولاً نتحقق من وجود القسم، ثم نقوم بالتحديث
   */
  async update(
    id: string,
    input: UpdateDepartmentInput,
  ): Promise<Department> {
    // التحقق من وجود القسم قبل التحديث
    await this.getById(id);

    const updated = await this.repository.update(id, input);
    if (!updated) {
      throw new AppError({
        message: "فشل تحديث القسم",
        code: "UPDATE_FAILED",
        statusCode: 500,
      });
    }
    return updated;
  }

  /*
   * حذف قسم
   * التحقق من وجود القسم قبل الحذف
   */
  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.remove(id);
  }
}

/*
 * تصدير نسخة واحدة (Singleton) للاستخدام في الكونترولر
 */
export const departmentService = new DepartmentService();