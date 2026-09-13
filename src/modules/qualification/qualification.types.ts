export type Qualification = {
  id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateQualificationInput = {
  organizationId: string;
  name: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateQualificationInput = Partial<CreateQualificationInput>;

export interface QualificationRepository {
  findAll(): Promise<Qualification[]>;
  findById(id: string): Promise<Qualification | null>;
  create(data: CreateQualificationInput): Promise<Qualification>;
  update(id: string, data: UpdateQualificationInput): Promise<Qualification | null>;
  remove(id: string): Promise<void>;
}

export interface QualificationService {
  getAll(): Promise<Qualification[]>;
  getById(id: string): Promise<Qualification | null>;
  create(input: CreateQualificationInput): Promise<Qualification>;
  update(
    id: string,
    input: UpdateQualificationInput,
  ): Promise<Qualification | null>;
  remove(id: string): Promise<void>;
}