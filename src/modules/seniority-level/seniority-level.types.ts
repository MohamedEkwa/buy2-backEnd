export type SeniorityLevel = {
  id: string;
  organizationId: string;
  name: string;
  rank: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateSeniorityLevelInput = {
  organizationId: string;
  name: string;
  rank: number;
  isActive?: boolean;
};

export type UpdateSeniorityLevelInput = Partial<CreateSeniorityLevelInput>;

export interface SeniorityLevelRepository {
  findAll(): Promise<SeniorityLevel[]>;
  findById(id: string): Promise<SeniorityLevel | null>;
  create(data: CreateSeniorityLevelInput): Promise<SeniorityLevel>;
  update(id: string, data: UpdateSeniorityLevelInput): Promise<SeniorityLevel | null>;
  remove(id: string): Promise<void>;
}

export interface SeniorityLevelService {
  getAll(): Promise<SeniorityLevel[]>;
  getById(id: string): Promise<SeniorityLevel | null>;
  create(input: CreateSeniorityLevelInput): Promise<SeniorityLevel>;
  update(
    id: string,
    input: UpdateSeniorityLevelInput,
  ): Promise<SeniorityLevel | null>;
  remove(id: string): Promise<void>;
}