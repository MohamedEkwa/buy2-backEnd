export type JobPosition = {
  id: string;
  departmentId: string;
  seniorityLevelId: string;
  managerJobPositionId?: string | null;
  title: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateJobPositionInput = {
  departmentId: string;
  seniorityLevelId: string;
  managerJobPositionId?: string;
  title: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateJobPositionInput = Partial<CreateJobPositionInput>;

export interface JobPositionRepository {
  findAll(): Promise<JobPosition[]>;
  findById(id: string): Promise<JobPosition | null>;
  create(data: CreateJobPositionInput): Promise<JobPosition>;
  update(id: string, data: UpdateJobPositionInput): Promise<JobPosition | null>;
  remove(id: string): Promise<void>;
}

export interface JobPositionService {
  getAll(): Promise<JobPosition[]>;
  getById(id: string): Promise<JobPosition | null>;
  create(input: CreateJobPositionInput): Promise<JobPosition>;
  update(
    id: string,
    input: UpdateJobPositionInput,
  ): Promise<JobPosition | null>;
  remove(id: string): Promise<void>;
}

export type JobService = JobPositionService;
