import { Router } from "express";

import { createHealthRouter } from "../modules/health/health.router.js";
import type { HealthService } from "../modules/health/health.types.js";
// 💡 تصدير واستيراد عناصر ميزة الـ Job من خلال ملفاتها المباشرة لضمان عدم حدوث مشاكل استيراد
export * from "../modules/job/job.types.js";
export { jobPositionService } from "../modules/job/job.service.js";
import type { JobService } from "../modules/job/job.types.js";
import { createJobRouter } from "../modules/job/job.router.js";

export type RouteDependencies = {
  healthService?: HealthService;
  jobService?: JobService;
};

export function createApiRouter(dependencies: RouteDependencies = {}): Router {
  const router = Router();
  router.use(createHealthRouter(dependencies.healthService));
  // تسجيل مسار الوظائف مع دعم حقن التبعيات لاختبارات الوحدة
  router.use(
    "/jobs",
    createJobRouter({ jobService: dependencies.jobService } as any),
  );
  return router;
}
