import { z } from "zod";

/*
 * مخطط التحقق من صحة البيانات (Zod Schemas)
 * يستخدم للتحقق من البيانات الواردة من الطلبات (Request Validation)
 * وتوثيق API عبر OpenAPI/Swagger
 */

export const CreateOrganizationSchema = z.object({
  name: z.string().min(2).max(150, { message: "اسم المنظمة يجب أن يكون بين 2 و 150 حرفاً" }),
  slug: z.string().min(2).max(150, { message: "المعرف المختصر (Slug) يجب أن يكون بين 2 و 150 حرفاً" }).regex(/^[a-z0-9-]+$/, { message: "المعرف المختصر يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط" }),
  isActive: z.boolean().optional(),
});

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

/*
 * مخطط استجابة المنظمة (Response Schema)
 * يحدد شكل البيانات التي سيتم إرجاعها للعميل
 */
export const OrganizationResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});