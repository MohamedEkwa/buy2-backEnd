import { z } from "zod";

/*
 * مخطط التحقق من صحة البيانات (Zod Schemas)
 * يستخدم للتحقق من البيانات الواردة من الطلبات (Request Validation)
 * وتوثيق API عبر OpenAPI/Swagger
 */

export const CreateSeniorityLevelSchema = z.object({
  organizationId: z.string().uuid({ message: "معرف المنظمة يجب أن يكون UUID صالحاً" }),
  name: z.string().min(2).max(100, { message: "اسم المستوى الوظيفي يجب أن يكون بين 2 و 100 حرفاً" }),
  rank: z.number().int().min(1, { message: "الترتيب (Rank) يجب أن يكون رقماً صحيحاً أكبر من صفر" }),
  isActive: z.boolean().optional(),
});

export const UpdateSeniorityLevelSchema = CreateSeniorityLevelSchema.partial();

/*
 * مخطط استجابة المستوى الوظيفي (Response Schema)
 * يحدد شكل البيانات التي سيتم إرجاعها للعميل
 * يشمل العلاقات الاختيارية (مثل المنظمة) التي قد تُجلب في الاستعلامات
 */
export const SeniorityLevelResponseSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string(),
  rank: z.number().int(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  // علاقة اختيارية: بيانات المنظمة المرتبطة
  organization: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      slug: z.string(),
    })
    .optional(),
});