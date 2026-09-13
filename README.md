# buy2-hrms-api

Backend API for the Buy2 HR Management System. Built with **Express 5**, **TypeScript**, **Prisma 7**, **PostgreSQL 17**, **Zod v4**, **Vitest**. Follows a strict **Feature-First Clean Architecture** (Router → Controller → Service → Repository) with **Multi-Tenant (Organization)** support.

---

## Tech Stack
- **Runtime:** Node.js 24+ (ESM)
- **Package Manager:** pnpm 10+
- **Framework:** Express 5
- **ORM:** Prisma 7 (PostgreSQL Adapter)
- **Validation:** Zod 4 (Request/Response + OpenAPI)
- **Testing:** Vitest + Supertest
- **Containerization:** Docker / Docker Compose

---

## Requirements
- Docker Desktop (with Compose) **running**
- Or: Node.js 24 LTS, pnpm 10, PostgreSQL 17 (local)

---

## Quick Start (Docker — Recommended)

```bash
# 1. Clone & enter
git clone <REPO_URL>
cd buy2-backEnd

# 2. Env
cp .env.example .env

# 3. Build & Start (DB + Migrations + Seed + App)
docker compose up --build -d

# 4. Verify
docker compose ps
# Expect: db (healthy), app (running)
```

**Access:**
- **API:** `http://localhost:3000/api/v1`
- **Health:** `http://localhost:3000/api/v1/health`
- **Swagger UI:** `http://localhost:3000/docs`
- **OpenAPI JSON:** `http://localhost:3000/api/v1/openapi.json`
- **Postgres:** `localhost:5433` (user: `postgres`, pass: `postgres`, db: `buy2_hrms`)

**Default Seed Data (auto-created):**
- Organization: `buy2` (slug: `buy2`)
- Super Admin: `admin@buy2.com` / `password123`
- HR Manager: `hr@buy2.com` / `password123`
- Departments, Seniority Levels, Qualifications, Job Positions (sample set)

---

## Docker Commands

| Command | Description |
|---------|-------------|
| `docker compose up --build -d` | Full start: build, migrate, seed, run (detached) |
| `docker compose up -d` | Quick start (cached images) |
| `docker compose ps` | Container status |
| `docker compose logs -f app` | Follow app logs (hot reload) |
| `docker compose down` | Stop & remove containers (keep DB volume) |
| `docker compose down -v` | **Nuclear reset**: stop + delete DB volume |

---

## Database (Prisma)

Migrations & Seed are **manual**, never auto-run on startup.

```bash
# Run pending migrations (dev)
docker compose exec app pnpm prisma migrate dev

# Generate Client after schema changes
docker compose exec app pnpm prisma generate

# Apply migrations (prod/CI)
docker compose exec app pnpm prisma migrate deploy

# Open Prisma Studio (GUI)
docker compose exec app pnpm prisma studio

# Re-run seed manually (idempotent)
docker compose exec app pnpm db:seed
```

---

## Host Development (Node on Host, DB in Docker)

```bash
# 1. Start Postgres only
docker compose up db -d

# 2. Install & Generate
pnpm install
pnpm prisma:generate

# 3. Migrate & Seed
pnpm prisma:migrate
pnpm db:seed

# 4. Dev server (hot reload)
pnpm dev
```

> `.env.example` points to `localhost:5432` (host-mapped port).

---

## Useful Scripts
```bash
pnpm typecheck   # TS compile check
pnpm build       # Production build
pnpm test        # Run Vitest suite
pnpm docker:up   # Alias: docker compose up --build
pnpm docker:down # Alias: docker compose down
```

---

## Architecture & Conventions

**Request Flow:** `Router → Middleware → Controller → Service → Repository → Prisma → PostgreSQL`

1. **Routers**: Declare routes, attach middleware/controllers, define OpenAPI metadata via `defineRoute()`.
2. **Controllers**: Adapt HTTP (req/res), call Services. No business logic.
3. **Services**: Pure business logic. Call Repositories. Validate rules.
4. **Repositories**: Own Prisma/database access. Return domain types.
5. **Modules** communicate via **Services** only — never Repositories directly.
6. **Validation**: Zod schemas on input (middleware). DB constraints as last line of defense.
6. **No abstraction** without a real requirement.

---

## Implemented Modules (Multi-Tenant Ready)

All domain modules are scoped by `organizationId`.

| Module | Endpoint | Description |
|--------|----------|-------------|
| **Organizations** | `/api/v1/organizations` | Tenant CRUD, slug lookup |
| **Departments** | `/api/v1/departments` | Org structure units |
| **Seniority Levels** | `/api/v1/seniority-levels` | Job ranking hierarchy |
| **Qualifications** | `/api/v1/qualifications` | Skills, degrees, certifications |
| **Job Positions** | `/api/v1/jobs` | Roles linked to Dept + Level + Quals |
| **Health** | `/api/v1/health` | Liveness/Readiness probe |

---

## API Documentation

**Contract:** Zod Schemas + Route Metadata (`defineRoute`). No Swagger JSDoc, no checked-in OpenAPI files, no source scanning.

**To add an endpoint:**
1. Define/update Zod request/response schemas in `module/schema.ts`.
2. Implement Repository → Service → Controller.
3. Declare route **once** in `module/router.ts` using `defineRoute()` (method, path, tags, summary, response schemas, optional middleware, optional `security: [{ bearerAuth: [] }]`).

`defineRoute()` registers the Express route, runs Zod validation middleware, and adds the operation to the OpenAPI registry. Document is generated once after routes mount.

Swagger UI includes `bearerAuth` JWT scheme. Use **Authorize** button to set Bearer token for authenticated routes.

---

## Project Structure
```
src/
├── config/           # Env & constants
├── database/         # Prisma client + adapter
├── middleware/       # Error, NotFound, Validation
├── modules/          # Feature modules (domain)
│   ├── organization/
│   ├── department/
│   ├── seniority-level/
│   ├── qualification/
│   ├── job/
│   └── health/
├── routes/           # API router composition
├── shared/           # Errors, HTTP helpers
├── app.ts            # Express factory
└── server.ts         # Entry point
prisma/
├── schema.prisma     # Data model (Multi-Tenant)
├── migrations/       # SQL migrations
└── seed.sql          # Baseline data (run manually in Studio/psql)
```