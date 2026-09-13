/*
  Warnings:

  - A unique constraint covering the columns `[organization_id,name]` on the table `departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,employee_code]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,department_id,seniority_level_id,title]` on the table `job_positions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,name]` on the table `qualifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,name]` on the table `seniority_levels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,rank]` on the table `seniority_levels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organization_id` to the `departments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `job_positions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `qualifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `seniority_levels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "departments_name_key";

-- DropIndex
DROP INDEX "employees_employee_code_key";

-- DropIndex
DROP INDEX "job_positions_department_id_seniority_level_id_title_key";

-- DropIndex
DROP INDEX "qualifications_name_key";

-- DropIndex
DROP INDEX "roles_name_key";

-- DropIndex
DROP INDEX "seniority_levels_name_key";

-- DropIndex
DROP INDEX "seniority_levels_rank_key";

-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "organization_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "organization_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "job_positions" ADD COLUMN     "organization_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "qualifications" ADD COLUMN     "organization_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "organization_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "seniority_levels" ADD COLUMN     "organization_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "organization_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE INDEX "idx_departments_organization_id" ON "departments"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "departments_organization_id_name_key" ON "departments"("organization_id", "name");

-- CreateIndex
CREATE INDEX "idx_employees_organization_id" ON "employees"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_organization_id_employee_code_key" ON "employees"("organization_id", "employee_code");

-- CreateIndex
CREATE INDEX "idx_job_positions_organization_id" ON "job_positions"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_positions_organization_id_department_id_seniority_level_key" ON "job_positions"("organization_id", "department_id", "seniority_level_id", "title");

-- CreateIndex
CREATE INDEX "idx_qualifications_organization_id" ON "qualifications"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "qualifications_organization_id_name_key" ON "qualifications"("organization_id", "name");

-- CreateIndex
CREATE INDEX "idx_roles_organization_id" ON "roles"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_organization_id_name_key" ON "roles"("organization_id", "name");

-- CreateIndex
CREATE INDEX "idx_seniority_levels_organization_id" ON "seniority_levels"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "seniority_levels_organization_id_name_key" ON "seniority_levels"("organization_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "seniority_levels_organization_id_rank_key" ON "seniority_levels"("organization_id", "rank");

-- CreateIndex
CREATE INDEX "idx_users_organization_id" ON "users"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_organization_id_email_key" ON "users"("organization_id", "email");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seniority_levels" ADD CONSTRAINT "seniority_levels_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualifications" ADD CONSTRAINT "qualifications_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_positions" ADD CONSTRAINT "job_positions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
