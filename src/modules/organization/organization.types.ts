export type Organization = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateOrganizationInput = {
  name: string;
  slug: string;
  isActive?: boolean;
};

export type UpdateOrganizationInput = Partial<CreateOrganizationInput>;

export interface OrganizationRepository {
  findAll(): Promise<Organization[]>;
  findById(id: string): Promise<Organization | null>;
  findBySlug(slug: string): Promise<Organization | null>;
  create(data: CreateOrganizationInput): Promise<Organization>;
  update(id: string, data: UpdateOrganizationInput): Promise<Organization | null>;
  remove(id: string): Promise<void>;
}

export interface OrganizationService {
  getAll(): Promise<Organization[]>;
  getById(id: string): Promise<Organization | null>;
  getBySlug(slug: string): Promise<Organization | null>;
  create(input: CreateOrganizationInput): Promise<Organization>;
  update(
    id: string,
    input: UpdateOrganizationInput,
  ): Promise<Organization | null>;
  remove(id: string): Promise<void>;
}