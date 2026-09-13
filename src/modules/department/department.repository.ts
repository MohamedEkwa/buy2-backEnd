import { prisma } from "../../database/prisma.js";
import type {
  CreateDepartmentInput,
  Department,
  DepartmentRepository as DepartmentRepositoryContract,
  UpdateDepartmentInput,
} from "./department.types.js";

/*
 * مستودع الأقسام (Department Repository)
 * مسؤول عن التواصل المباشر مع قاعدة البيانات عبر Prisma
 * ينفذ العمليات الأساسية: جلب، إنشاء، تحديث، حذف
 */
export class PrismaDepartmentRepository implements DepartmentRepositoryContract {
  // تحديد العلاقات التي سيتم جلبها دائماً مع القسم
  private readonly includeAll = {
    organization: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
  };

  /*
   * جلب جميع الأقسام مع بيانات المنظمة المرتبطة
   */
  async findAll(): Promise<Department[]> {
    return prisma.department.findMany({
      include: this.includeAll,
    });
  }

  /*
   * جلب قسم محدد بواسطة المعرف (ID)
   */
  async findById(id: string): Promise<Department | null> {
    return prisma.department.findUnique({
      where: { id },
      include: this.includeAll,
    });
  }

  /*
   * إنشاء قسم جديد
   */
  async create(data: CreateDepartmentInput): Promise<Department> {
    return prisma.department.create({
      data,
      include: this.includeAll,
    });
  }

  /*
   * تحديث قسم موجود
   */
  async update(
    id: string,
    data: UpdateDepartmentInput,
  ): Promise<Department | null> {
    return prisma.department.update({
      where: { id },
      data,
      include: this.includeAll,
    });
  }

  /*
   * حذف قسم
   */
  async remove(id: string): Promise<void> {
    await prisma.department.delete({
      where: { id },
    });
  }
}

/*
 * تصدير نسخة واحدة (Singleton) للاستخدام في الخدمة
 */
export const departmentRepository = new PrismaDepartmentRepository();