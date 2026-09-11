import { AppError } from "../../shared/errors/app-error.js";
import type {
  JobPositionRepository,
  JobPosition,
  CreateJobPositionInput,
  UpdateJobPositionInput,
} from "./job.types.js";
import { jobPositionRepository } from "./jop.repository.js";

export class JobPositionService {
  constructor(
    private readonly repository: JobPositionRepository = jobPositionRepository,
  ) {}

  async getAll(): Promise<JobPosition[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<JobPosition> {
    const job = await this.repository.findById(id);
    if (!job) {
      // 💡 تم تمرير معامل واحد فقط ككائن إعدادات لحل الخطأ TS2554
      throw new AppError({
        message: "The requested job position does not exist",
        code: "JOB_NOT_FOUND",
        status: 404,
      } as any);
    }
    return job;
  }

  async create(input: CreateJobPositionInput): Promise<JobPosition> {
    return this.repository.create(input);
  }

  async update(
    id: string,
    input: UpdateJobPositionInput,
  ): Promise<JobPosition> {
    await this.getById(id);
    const updated = await this.repository.update(id, input);
    if (!updated) {
      throw new AppError({
        message: "Failed to update job position",
        code: "UPDATE_FAILED",
        status: 500,
      } as any);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.remove(id);
  }
}

export const jobPositionService = new JobPositionService();
