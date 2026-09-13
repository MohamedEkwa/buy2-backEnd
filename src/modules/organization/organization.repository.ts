import { prisma } from "../../database/prisma.js";
import type {
  CreateOrganizationInput,
  Organization,
  OrganizationRepository as OrganizationRepositoryContract,
  UpdateOrganizationInput,
} from "./organization.types.js";

/*
 * مستودع المنظمات (Organization Repository)
 * مسؤول عن التواصل المباشر مع قاعدة البيانات عبر Prisma
 * ينفذ العمليات الأساسية: جلب، إنشاء، تحديث، حذف
 */
export class PrismaOrganizationRepository implements OrganizationRepositoryContract {

  /*
   * جلب جميع المنظمات
   */
  async findAll(): Promise<Organization[]> {
    return prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /*
   * جلب منظمة محددة بواسطة المعرف (ID)
   */
  async findById(id: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { id },
    });
  }

  /*
   * جلب منظمة بواسطة المعرف المختصر (Slug)
   * مفيد للبحث بالاسم المختصر بدلاً من UUID
   */
  async findBySlug(slug: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { slug },
    });
  }

  /*
   * إنشاء منظمة جديدة
   */
  async create(data: CreateOrganizationInput): Promise<Organization> {
    return prisma.organization.create({
      data,
    });
  }

  /*
   * تحديث منظمة موجودة
   */
  async update(
    id: string,
    data: UpdateOrganizationInput,
  ): Promise<Organization | null> {
    return prisma.organization.update({
      where: { id },
      data,
    });
  }

  /*
   * حذف منظمة
   * ملاحظة: الحذف سيتم بشكل متسلسل (Cascade) لكل البيانات المرتبطة
   * (الأقسام، الموظفين، المستخدمين، إلخ) حسب إعدادات الـ Schema
   */
  async remove(id: string): Promise<void> {
    await prisma.organization.delete({
      where: { id },
    });
  }
}

/*
 * تصدير نسخة واحدة (Singleton) للاستخدام في الخدمة
 */
export const organizationRepository = new PrismaOrganizationRepository();