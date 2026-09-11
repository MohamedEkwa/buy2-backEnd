-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" UUID NOT NULL,
    "feature" VARCHAR(100) NOT NULL,
    "action" VARCHAR(20) NOT NULL,
    "scope" VARCHAR(30) NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","feature","action","scope")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "role_id" UUID,
    "email" VARCHAR(320) NOT NULL,
    "password_hash" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING_SETUP',
    "must_change_password" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_challenges" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "purpose" VARCHAR(30) NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "resend_count" INTEGER NOT NULL DEFAULT 0,
    "consumed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "storage_key" TEXT NOT NULL,
    "mime_type" VARCHAR(100),
    "size_bytes" BIGINT,
    "uploaded_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "document_type" VARCHAR(50),
    "title" VARCHAR(200),
    "issued_at" DATE,
    "expires_at" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seniority_levels" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "rank" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seniority_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualifications" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_positions" (
    "id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "seniority_level_id" UUID NOT NULL,
    "manager_job_position_id" UUID,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_position_qualifications" (
    "job_position_id" UUID NOT NULL,
    "qualification_id" UUID NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "job_position_qualifications_pkey" PRIMARY KEY ("job_position_id","qualification_id")
);

-- CreateTable
CREATE TABLE "job_schedule_policies" (
    "job_position_id" UUID NOT NULL,
    "schedule_type" VARCHAR(20),
    "check_in_from" TIME(6),
    "check_in_to" TIME(6),
    "check_out_from" TIME(6),
    "check_out_to" TIME(6),
    "hours_per_day" DECIMAL(4,2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_schedule_policies_pkey" PRIMARY KEY ("job_position_id")
);

-- CreateTable
CREATE TABLE "job_metric_definitions" (
    "id" UUID NOT NULL,
    "job_position_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "measure" VARCHAR(100),
    "target_value" DECIMAL(12,2),
    "weight" DECIMAL(5,2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_metric_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixed_task_definitions" (
    "id" UUID NOT NULL,
    "job_position_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "repeat_type" VARCHAR(30),
    "repeat_config" JSONB,
    "submission_time" TIME(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fixed_task_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixed_task_steps" (
    "id" UUID NOT NULL,
    "fixed_task_id" UUID NOT NULL,
    "step_order" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fixed_task_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixed_task_documents" (
    "fixed_task_id" UUID NOT NULL,
    "document_id" UUID NOT NULL,

    CONSTRAINT "fixed_task_documents_pkey" PRIMARY KEY ("fixed_task_id","document_id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL,
    "employee_code" VARCHAR(50) NOT NULL,
    "user_id" UUID,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "gender" VARCHAR(20),
    "phone" VARCHAR(30),
    "profile_image_file_id" UUID,
    "country" VARCHAR(100),
    "city" VARCHAR(100),
    "hire_date" DATE,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "employment_type" VARCHAR(30),
    "experience_years" DECIMAL(4,1),
    "job_position_id" UUID NOT NULL,
    "manager_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_qualifications" (
    "employee_id" UUID NOT NULL,
    "qualification_id" UUID NOT NULL,
    "acquired_at" DATE,
    "expires_at" DATE,

    CONSTRAINT "employee_qualifications_pkey" PRIMARY KEY ("employee_id","qualification_id")
);

-- CreateTable
CREATE TABLE "employee_payroll" (
    "employee_id" UUID NOT NULL,
    "salary_type" VARCHAR(20),
    "payout_period" VARCHAR(20),
    "payout_day" VARCHAR(20),
    "work_week_start" VARCHAR(10),
    "work_week_end" VARCHAR(10),
    "base_pay_amount" DECIMAL(12,2),
    "currency_code" CHAR(3),
    "overtime_threshold_hours" DECIMAL(6,2),
    "overtime_period" VARCHAR(20),
    "overtime_hourly_rate" DECIMAL(12,2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_payroll_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "employee_documents" (
    "employee_id" UUID NOT NULL,
    "document_id" UUID NOT NULL,

    CONSTRAINT "employee_documents_pkey" PRIMARY KEY ("employee_id","document_id")
);

-- CreateTable
CREATE TABLE "employee_violations" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "recorded_by_user_id" UUID,
    "category" VARCHAR(150),
    "severity" VARCHAR(20),
    "description" TEXT,
    "witness_statement" TEXT,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_violations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_violation_documents" (
    "violation_id" UUID NOT NULL,
    "document_id" UUID NOT NULL,

    CONSTRAINT "employee_violation_documents_pkey" PRIMARY KEY ("violation_id","document_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_role_id" ON "users"("role_id");

-- CreateIndex
CREATE INDEX "idx_auth_challenges_user_id" ON "auth_challenges"("user_id");

-- CreateIndex
CREATE INDEX "idx_auth_challenges_expires_at" ON "auth_challenges"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "files_storage_key_key" ON "files"("storage_key");

-- CreateIndex
CREATE INDEX "idx_files_uploaded_by_user_id" ON "files"("uploaded_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "documents_file_id_key" ON "documents"("file_id");

-- CreateIndex
CREATE INDEX "idx_documents_document_type" ON "documents"("document_type");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "seniority_levels_name_key" ON "seniority_levels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "seniority_levels_rank_key" ON "seniority_levels"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "qualifications_name_key" ON "qualifications"("name");

-- CreateIndex
CREATE INDEX "idx_job_positions_department_id" ON "job_positions"("department_id");

-- CreateIndex
CREATE INDEX "idx_job_positions_seniority_level_id" ON "job_positions"("seniority_level_id");

-- CreateIndex
CREATE INDEX "idx_job_positions_manager_job_position_id" ON "job_positions"("manager_job_position_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_positions_department_id_seniority_level_id_title_key" ON "job_positions"("department_id", "seniority_level_id", "title");

-- CreateIndex
CREATE INDEX "idx_job_position_qualifications_qualification_id" ON "job_position_qualifications"("qualification_id");

-- CreateIndex
CREATE INDEX "idx_job_metric_definitions_job_position_id" ON "job_metric_definitions"("job_position_id");

-- CreateIndex
CREATE INDEX "idx_fixed_task_definitions_job_position_id" ON "fixed_task_definitions"("job_position_id");

-- CreateIndex
CREATE INDEX "idx_fixed_task_steps_fixed_task_id" ON "fixed_task_steps"("fixed_task_id");

-- CreateIndex
CREATE UNIQUE INDEX "fixed_task_steps_fixed_task_id_step_order_key" ON "fixed_task_steps"("fixed_task_id", "step_order");

-- CreateIndex
CREATE INDEX "idx_fixed_task_documents_document_id" ON "fixed_task_documents"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employee_code_key" ON "employees"("employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "employees_user_id_key" ON "employees"("user_id");

-- CreateIndex
CREATE INDEX "idx_employees_job_position_id" ON "employees"("job_position_id");

-- CreateIndex
CREATE INDEX "idx_employees_manager_id" ON "employees"("manager_id");

-- CreateIndex
CREATE INDEX "idx_employees_profile_image_file_id" ON "employees"("profile_image_file_id");

-- CreateIndex
CREATE INDEX "idx_employee_qualifications_qualification_id" ON "employee_qualifications"("qualification_id");

-- CreateIndex
CREATE INDEX "idx_employee_documents_document_id" ON "employee_documents"("document_id");

-- CreateIndex
CREATE INDEX "idx_employee_violations_employee_id" ON "employee_violations"("employee_id");

-- CreateIndex
CREATE INDEX "idx_employee_violations_recorded_by_user_id" ON "employee_violations"("recorded_by_user_id");

-- CreateIndex
CREATE INDEX "idx_employee_violations_occurred_at" ON "employee_violations"("occurred_at");

-- CreateIndex
CREATE INDEX "idx_employee_violation_documents_document_id" ON "employee_violation_documents"("document_id");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_challenges" ADD CONSTRAINT "auth_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_positions" ADD CONSTRAINT "job_positions_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_positions" ADD CONSTRAINT "job_positions_seniority_level_id_fkey" FOREIGN KEY ("seniority_level_id") REFERENCES "seniority_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_positions" ADD CONSTRAINT "job_positions_manager_job_position_id_fkey" FOREIGN KEY ("manager_job_position_id") REFERENCES "job_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_position_qualifications" ADD CONSTRAINT "job_position_qualifications_job_position_id_fkey" FOREIGN KEY ("job_position_id") REFERENCES "job_positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_position_qualifications" ADD CONSTRAINT "job_position_qualifications_qualification_id_fkey" FOREIGN KEY ("qualification_id") REFERENCES "qualifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_schedule_policies" ADD CONSTRAINT "job_schedule_policies_job_position_id_fkey" FOREIGN KEY ("job_position_id") REFERENCES "job_positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_metric_definitions" ADD CONSTRAINT "job_metric_definitions_job_position_id_fkey" FOREIGN KEY ("job_position_id") REFERENCES "job_positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_task_definitions" ADD CONSTRAINT "fixed_task_definitions_job_position_id_fkey" FOREIGN KEY ("job_position_id") REFERENCES "job_positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_task_steps" ADD CONSTRAINT "fixed_task_steps_fixed_task_id_fkey" FOREIGN KEY ("fixed_task_id") REFERENCES "fixed_task_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_task_documents" ADD CONSTRAINT "fixed_task_documents_fixed_task_id_fkey" FOREIGN KEY ("fixed_task_id") REFERENCES "fixed_task_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_task_documents" ADD CONSTRAINT "fixed_task_documents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_profile_image_file_id_fkey" FOREIGN KEY ("profile_image_file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_job_position_id_fkey" FOREIGN KEY ("job_position_id") REFERENCES "job_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_qualifications" ADD CONSTRAINT "employee_qualifications_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_qualifications" ADD CONSTRAINT "employee_qualifications_qualification_id_fkey" FOREIGN KEY ("qualification_id") REFERENCES "qualifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_payroll" ADD CONSTRAINT "employee_payroll_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_violations" ADD CONSTRAINT "employee_violations_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_violations" ADD CONSTRAINT "employee_violations_recorded_by_user_id_fkey" FOREIGN KEY ("recorded_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_violation_documents" ADD CONSTRAINT "employee_violation_documents_violation_id_fkey" FOREIGN KEY ("violation_id") REFERENCES "employee_violations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_violation_documents" ADD CONSTRAINT "employee_violation_documents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
