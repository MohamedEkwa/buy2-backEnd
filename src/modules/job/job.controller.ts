import type { Request, Response, NextFunction, RequestHandler } from "express";
import { jobPositionService } from "./job.service.js";
import type { JobPositionService as JobPositionServiceType } from "./job.service.js";
import type {
  CreateJobPositionInput,
  UpdateJobPositionInput,
} from "./job.types.js";
import { AppError } from "../../shared/errors/app-error.js";

export class JobPositionController {
  constructor(
    private readonly service: JobPositionServiceType = jobPositionService,
  ) {}

  // دالة مساعدة لضمان استخلاص معرف نصي نقي
  private getCleanId(paramId: string | string[] | undefined): string {
    if (!paramId || typeof paramId !== "string") {
      throw new AppError({
        message: "Invalid or missing ID parameter",
        code: "INVALID_ID",
        status: 400,
      } as any);
    }
    return paramId;
  }

  getAll: RequestHandler = async (req, res, next) => {
    try {
      const jobs = await this.service.getAll();
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  };

  getById: RequestHandler = async (req, res, next) => {
    try {
      const cleanId = this.getCleanId(req.params.id); // 💡 حل مشكلة النوع البرمجي
      const job = await this.service.getById(cleanId);
      res.status(200).json(job);
    } catch (error) {
      next(error);
    }
  };

  create: RequestHandler = async (req, res, next) => {
    try {
      const payload = (req as any).validated?.body as CreateJobPositionInput;
      const job = await this.service.create(payload);
      res.status(201).json(job);
    } catch (error) {
      next(error);
    }
  };

  update: RequestHandler = async (req, res, next) => {
    try {
      const cleanId = this.getCleanId(req.params.id); // 💡 حل مشكلة النوع البرمجي
      const payload = (req as any).validated?.body as UpdateJobPositionInput;
      const job = await this.service.update(cleanId, payload);
      res.status(200).json(job);
    } catch (error) {
      next(error);
    }
  };

  delete: RequestHandler = async (req, res, next) => {
    try {
      const cleanId = this.getCleanId(req.params.id); // 💡 حل مشكلة النوع البرمجي
      await this.service.remove(cleanId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const jobPositionController = new JobPositionController();
