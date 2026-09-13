import { Router } from "express";

import { createHealthRouter } from "../modules/health/health.router.js";
import type { HealthService } from "../modules/health/health.types.js";
// 💡 تصدير واستيراد عناصر ميزة الـ Job من خلال ملفاتها المباشرة لضمان عدم حدوث مشاكل استيراد
import { createJobRouter } from "../modules/job/job.router.js";
import type { JobService } from "../modules/job/job.types.js";
// 💡 استيراد راوتر قسم department
import { createDepartmentRouter } from "../modules/department/department.router.js";
import type { DepartmentService } from "../modules/department/department.types.js";
// 💡 استيراد راوتر المستويات الوظيفية
import { createSeniorityLevelRouter } from "../modules/seniority-level/seniority-level.router.js";
import type { SeniorityLevelService } from "../modules/seniority-level/seniority-level.types.js";
// 💡 استيراد راوتر المنظمات الجديد
import { createOrganizationRouter } from "../modules/organization/organization.router.js";
import type { OrganizationService } from "../modules/organization/organization.types.js";

export type RouteDependencies = {
  healthService?: HealthService;
  jobService?: JobService;
  departmentService?: DepartmentService;
  seniorityLevelService?: SeniorityLevelService;
  organizationService?: OrganizationService;
};

export function createApiRouter(dependencies: RouteDependencies = {}): Router {
  const router = Router();
  router.use(createHealthRouter(dependencies.healthService));

  // تسجيل مسار الوظائف مع دعم حقن التبعيات لاختبارات الوحدة
  router.use(
    "/jobs",
    createJobRouter({ jobService: dependencies.jobService } as any),
  );

  // تسجيل مسار قسم department
  router.use(
    "/departments",
    createDepartmentRouter({
      departmentService: dependencies.departmentService,
    } as any),
  );

  // تسجيل مسار المستويات الوظيفية
  router.use(
    "/seniority-levels",
    createSeniorityLevelRouter({ seniorityLevelService: dependencies.seniorityLevelService } as any),
  );

  // تسجيل مسار المنظمات الجديد
  router.use(
    "/organizations",
    createOrganizationRouter({ organizationService: dependencies.organizationService } as any),
  );

  return router;
}
