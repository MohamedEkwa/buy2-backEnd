export type Department = {
  id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDepartmentInput = {
  organizationId: string;
  name: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;

export interface DepartmentRepository {
  findAll(): Promise<Department[]>;
  findById(id: string): Promise<Department | null>;
  create(data: CreateDepartmentInput): Promise<Department>;
  update(id: string, data: UpdateDepartmentInput): Promise<Department | null>;
  remove(id: string): Promise<void>;
}

export interface DepartmentService {
  getAll(): Promise<Department[]>;
  getById(id: string): Promise<Department | null>;
  create(input: CreateDepartmentInput): Promise<Department>;
  update(
    id: string,
    input: UpdateDepartmentInput,
  ): Promise<Department | null>;
  remove(id: string): Promise<void>;
}