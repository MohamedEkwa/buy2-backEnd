# Quick Start for New Developers

This repository is the backend foundation for the Buy2 HR Management System. It is a TypeScript API built with Express, Prisma, PostgreSQL, Zod, and Docker.

## Prerequisites

- Docker Desktop and Docker Compose (recommended)
- Or Node.js 24+ and pnpm 10+ for running the API on your machine

## Start the Project

1. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

2. Start the API and PostgreSQL:

   ```bash
   docker compose up --build
   ```

3. Verify that both the API and database are ready:

   ```bash
   curl http://localhost:3000/api/v1/health
   ```

   Expected response:

   ```json
   { "status": "ok" }
   ```

## Local URLs

- API base URL: `http://localhost:3000/api/v1`
- Health check: `http://localhost:3000/api/v1/health`
- Swagger UI: `http://localhost:3000/docs`
- OpenAPI document: `http://localhost:3000/api/v1/openapi.json`
- PostgreSQL on the host: `localhost:5432`

If a port is already in use, set `API_HOST_PORT` or `POSTGRES_HOST_PORT` before starting Compose.

## Common Commands

Run these on the host:

```bash
pnpm test
pnpm typecheck
pnpm build
```

Run Prisma commands in the app container:

```bash
docker compose exec app pnpm prisma migrate dev
docker compose exec app pnpm prisma generate
docker compose exec app pnpm prisma migrate deploy
docker compose exec app pnpm prisma studio
```

Stop the local environment:

```bash
docker compose down
```

To reset the local PostgreSQL data, use `docker compose down -v`. This permanently deletes the local database volume.

## How the Code Is Organized

Each feature is a module under `src/modules`. The health module is the reference implementation:

```text
src/modules/health/
  health.schema.ts       # Zod request/response schemas
  health.types.ts        # Module interfaces and types
  health.repository.ts   # Prisma/database access
  health.service.ts      # Business rules
  health.controller.ts   # HTTP request/response handling
  health.router.ts       # Endpoint declarations
```

Requests follow this direction:

```text
Router -> Middleware -> Controller -> Service -> Repository -> Prisma -> PostgreSQL
```

Mount a new module router in `src/routes/index.ts`.

## Add an Endpoint

1. Add or update Zod schemas in the module's `*.schema.ts` file.
2. Implement database calls in its repository.
3. Put business rules in its service.
4. Adapt the HTTP request in its controller.
5. Declare the route once in its router with `defineRoute()`.
6. Add the router to `src/routes/index.ts`.
7. Add tests and run `pnpm test` and `pnpm typecheck`.

`defineRoute()` is important: it registers the Express endpoint, applies any Zod validation, and adds the operation to the generated OpenAPI documentation.

## Working with the Database

Define new models in `prisma/schema.prisma`, then create a migration explicitly:

```bash
docker compose exec app pnpm prisma migrate dev
```

Migrations never run automatically when the API starts. Commit the migration files produced by Prisma with the related model and feature code.

## Project Rules

- Routers declare routes; they do not contain business logic.
- Controllers call services; they do not access Prisma.
- Services contain business rules and may call repositories.
- Repositories own Prisma/database access.
- Modules use another module's service, never its repository directly.
- Use Zod for HTTP input validation and API response contracts.
- Use `AppError` for expected application errors so clients receive the standard error shape.

## Run Without the App Container

If you prefer running the API directly on your machine:

```bash
cp .env.example .env
docker compose up db -d
pnpm install
pnpm prisma:generate
pnpm dev
```

In this mode, the default `DATABASE_URL` in `.env` connects to PostgreSQL at `localhost:5432`.
