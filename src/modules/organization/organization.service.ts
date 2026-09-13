import { AppError } from "../../shared/errors/app-error.js";
import type {
  CreateOrganizationInput,
  Organization,
  OrganizationRepository,
  UpdateOrganizationInput,
} from "./organization.types.js";
import { organizationRepository } from "./organization.repository.js";

/*
 * خدمة المنظمات (Organization Service)
 * تحتوي على منطق العمل (Business Logic)
 * تتعامل مع المستودع (Repository) وتطبق قواعد العمل
 */
export class OrganizationService {
  constructor(
    private readonly repository: OrganizationRepository = organizationRepository,
  ) {}

  /*
   * جلب جميع المنظمات
   */
  async getAll(): Promise<Organization[]> {
    return this.repository.findAll();
  }

  /*
   * جلب منظمة بواسطة المعرف
   * يرمي خطأ إذا لم يتم العثور على المنظمة
   */
  async getById(id: string): Promise<Organization> {
    const organization = await this.repository.findById(id);
    if (!organization) {
      throw new AppError({
        message: "المنظمة المطلوبة غير موجودة",
        code: "ORGANIZATION_NOT_FOUND",
        statusCode: 404,
      });
    }
    return organization;
  }

  /*
   * جلب منظمة بواسطة المعرف المختصر (Slug)
   */
  async getBySlug(slug: string): Promise<Organization | null> {
    return this.repository.findBySlug(slug);
  }

  /*
   * إنشاء منظمة جديدة
   * منطق العمل: التحقق من عدم تكرار الاسم أو الـ Slug يتم على مستوى قاعدة البيانات (Unique Constraint)
   */
  async create(input: CreateOrganizationInput): Promise<Organization> {
    // التحقق من عدم وجود منظمة بنفس الـ Slug مسبقاً (اختياري، لأن قاعدة البيانات ستتعامل معه)
    const existing = await this.repository.findBySlug(input.slug);
    if (existing) {
      throw new AppError({
        message: "يوجد منظمة مسجلة بهذا المعرف المختصر (Slug) بالفعل",
        code: "SLUG_ALREADY_EXISTS",
        statusCode: 409, // Conflict
      });
    }
    return this.repository.create(input);
  }

  /*
   * تحديث منظمة موجودة
   * أولاً نتحقق من وجود المنظمة، ثم نقوم بالتحديث
   */
  async update(
    id: string,
    input: UpdateOrganizationInput,
  ): Promise<Organization> {
    // التحقق من وجود المنظمة قبل التحديث
    await this.getById(id);

    // إذا تم تحديث الـ Slug، نتأكد من عدم تكراره
    if (input.slug) {
      const existing = await this.repository.findBySlug(input.slug);
      if (existing && existing.id !== id) {
        throw new AppError({
          message: "يوجد منظمة أخرى مسجلة بهذا المعرف المختصر (Slug)",
          code: "SLUG_ALREADY_EXISTS",
          statusCode: 409,
        });
      }
    }

    const updated = await this.repository.update(id, input);
    if (!updated) {
      throw new AppError({
        message: "فشل تحديث المنظمة",
        code: "UPDATE_FAILED",
        statusCode: 500,
      });
    }
    return updated;
  }

  /*
   * حذف منظمة
   * التحقق من وجود المنظمة قبل الحذف
   * تحذير: هذا سيحذف كل البيانات المرتبطة (Cascade Delete)
   */
  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.remove(id);
  }
}

/*
 * تصدير نسخة واحدة (Singleton) للاستخدام في الكونترولر
 */
export const organizationService = new OrganizationService();