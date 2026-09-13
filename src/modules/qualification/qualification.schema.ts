import { z } from "zod";

/*
 * مخطط التحقق من صحة البيانات (Zod Schemas)
 * يستخدم للتحقق من البيانات الواردة من الطلبات (Request Validation)
 * وتوثيق API عبر OpenAPI/Swagger
 */

export const CreateQualificationSchema = z.object({
  organizationId: z.string().uuid({ message: "معرف المنظمة يجب أن يكون UUID صالحاً" }),
  name: z.string().min(2).max(150, { message: "اسم المؤهل يجب أن يكون بين 2 و 150 حرفاً" }),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateQualificationSchema = CreateQualificationSchema.partial();

/*
 * مخطط استجابة المؤهل (Response Schema)
 * يحدد شكل البيانات التي سيتم إرجاعها للعميل
 * يشمل العلاقات الاختيارية (مثل المنظمة) التي قد تُجلب في الاستعلامات
 */
export const QualificationResponseSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
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