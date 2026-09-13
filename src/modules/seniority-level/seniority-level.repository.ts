import { prisma } from "../../database/prisma.js";
import type {
  CreateSeniorityLevelInput,
  SeniorityLevel,
  SeniorityLevelRepository as SeniorityLevelRepositoryContract,
  UpdateSeniorityLevelInput,
} from "./seniority-level.types.js";

/*
 * مستودع المستويات الوظيفية (SeniorityLevel Repository)
 * مسؤول عن التواصل المباشر مع قاعدة البيانات عبر Prisma
 * ينفذ العمليات الأساسية: جلب، إنشاء، تحديث، حذف
 */
export class PrismaSeniorityLevelRepository implements SeniorityLevelRepositoryContract {
  // تحديد العلاقات التي سيتم جلبها دائماً مع المستوى الوظيفي
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
   * جلب جميع المستويات الوظيفية مع بيانات المنظمة المرتبطة
   */
  async findAll(): Promise<SeniorityLevel[]> {
    return prisma.seniorityLevel.findMany({
      include: this.includeAll,
    });
  }

  /*
   * جلب مستوى وظيفي محدد بواسطة المعرف (ID)
   */
  async findById(id: string): Promise<SeniorityLevel | null> {
    return prisma.seniorityLevel.findUnique({
      where: { id },
      include: this.includeAll,
    });
  }

  /*
   * إنشاء مستوى وظيفي جديد
   */
  async create(data: CreateSeniorityLevelInput): Promise<SeniorityLevel> {
    return prisma.seniorityLevel.create({
      data,
      include: this.includeAll,
    });
  }

  /*
   * تحديث مستوى وظيفي موجود
   */
  async update(
    id: string,
    data: UpdateSeniorityLevelInput,
  ): Promise<SeniorityLevel | null> {
    return prisma.seniorityLevel.update({
      where: { id },
      data,
      include: this.includeAll,
    });
  }

  /*
   * حذف مستوى وظيفي
   */
  async remove(id: string): Promise<void> {
    await prisma.seniorityLevel.delete({
      where: { id },
    });
  }
}

/*
 * تصدير نسخة واحدة (Singleton) للاستخدام في الخدمة
 */
export const seniorityLevelRepository = new PrismaSeniorityLevelRepository();