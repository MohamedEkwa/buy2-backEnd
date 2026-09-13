import { prisma } from "../../database/prisma.js";
import type {
  CreateQualificationInput,
  Qualification,
  QualificationRepository as QualificationRepositoryContract,
  UpdateQualificationInput,
} from "./qualification.types.js";

/*
 * مستودع المؤهلات (Qualification Repository)
 * مسؤول عن التواصل المباشر مع قاعدة البيانات عبر Prisma
 * ينفذ العمليات الأساسية: جلب، إنشاء، تحديث، حذف
 */
export class PrismaQualificationRepository implements QualificationRepositoryContract {
  // تحديد العلاقات التي سيتم جلبها دائماً مع المؤهل
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
   * جلب جميع المؤهلات مع بيانات المنظمة المرتبطة
   */
  async findAll(): Promise<Qualification[]> {
    return prisma.qualification.findMany({
      include: this.includeAll,
    });
  }

  /*
   * جلب مؤهل محدد بواسطة المعرف (ID)
   */
  async findById(id: string): Promise<Qualification | null> {
    return prisma.qualification.findUnique({
      where: { id },
      include: this.includeAll,
    });
  }

  /*
   * إنشاء مؤهل جديد
   */
  async create(data: CreateQualificationInput): Promise<Qualification> {
    return prisma.qualification.create({
      data,
      include: this.includeAll,
    });
  }

  /*
   * تحديث مؤهل موجود
   */
  async update(
    id: string,
    data: UpdateQualificationInput,
  ): Promise<Qualification | null> {
    return prisma.qualification.update({
      where: { id },
      data,
      include: this.includeAll,
    });
  }

  /*
   * حذف مؤهل
   */
  async remove(id: string): Promise<void> {
    await prisma.qualification.delete({
      where: { id },
    });
  }
}

/*
 * تصدير نسخة واحدة (Singleton) للاستخدام في الخدمة
 */
export const qualificationRepository = new PrismaQualificationRepository();