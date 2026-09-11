import { prisma } from "../../database/prisma.js";
import type {
  CreateJobPositionInput,
  JobPosition,
  JobPositionRepository as JobPositionRepositoryContract,
  UpdateJobPositionInput,
} from "./job.types.js";

export class PrismaJobPositionRepository implements JobPositionRepositoryContract {
  private readonly includeAll = {
    department: true,
    seniorityLevel: true,
    qualifications: true,
    schedulePolicy: true,
    employees: true,
  };

  async findAll(): Promise<JobPosition[]> {
    return prisma.jobPosition.findMany({
      include: this.includeAll,
    });
  }

  async findById(id: string): Promise<JobPosition | null> {
    return prisma.jobPosition.findUnique({
      where: { id },
      include: this.includeAll,
    });
  }

  async create(data: CreateJobPositionInput): Promise<JobPosition> {
    return prisma.jobPosition.create({
      data,
      include: this.includeAll,
    });
  }

  async update(
    id: string,
    data: UpdateJobPositionInput,
  ): Promise<JobPosition | null> {
    return prisma.jobPosition.update({
      where: { id },
      data,
      include: this.includeAll,
    });
  }

  async remove(id: string): Promise<void> {
    await prisma.jobPosition.delete({
      where: { id },
    });
  }
}

export const jobPositionRepository = new PrismaJobPositionRepository();
