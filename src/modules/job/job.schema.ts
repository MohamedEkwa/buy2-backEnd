import { z } from "zod";

export const CreateJobPositionSchema = z.object({
  departmentId: z.string().uuid(),
  seniorityLevelId: z.string().uuid(),
  managerJobPositionId: z.string().uuid().optional(),
  title: z.string().min(3).max(150),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateJobPositionSchema = CreateJobPositionSchema.partial();

export const JobPositionResponseSchema = z.object({
  id: z.string().uuid(),
  departmentId: z.string().uuid(),
  seniorityLevelId: z.string().uuid(),
  managerJobPositionId: z.string().uuid().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  // علاقات اختيارية يمكن جلبها في الاستعلامات
  department: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .optional(),
  seniorityLevel: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      rank: z.number(),
    })
    .optional(),
});
