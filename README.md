# buy2-hrms-api

Backend foundation for the Buy2 HR Management System. It uses Express, TypeScript, Prisma, and PostgreSQL with a feature-first N-tier architecture.

## Requirements

- Docker Desktop with Docker Compose (recommended)
- Or Node.js 24 LTS and pnpm 10 for host development

## Recommended development workflow: Docker

```bash
cp .env.example .env
docker compose up --build
```

API: <http://localhost:3000/api/v1/health>

API documentation: <http://localhost:3000/docs>

OpenAPI JSON: <http://localhost:3000/api/v1/openapi.json>

PostgreSQL: `localhost:5433`

The app container connects to PostgreSQL at `db:5432`; a host process connects at `localhost:5433`.
If either default host port is busy, set `API_HOST_PORT` and/or `POSTGRES_HOST_PORT` before `docker compose up`.
Set `API_DOCS_ENABLED=false` to disable both the Swagger UI and public OpenAPI JSON endpoint. It defaults to `true` for this development-focused foundation; set it explicitly in production deployment configuration.

Stop the environment:

```bash
docker compose down
```

Reset local database data:

```bash
docker compose down -v
```

Warning: `-v` permanently deletes the local `postgres_data` volume.

### Prisma commands in Docker

Schema migrations are deliberate developer actions and never run on normal application startup.

```bash
docker compose exec app pnpm prisma migrate dev
docker compose exec app pnpm prisma generate
docker compose exec app pnpm prisma migrate deploy
docker compose exec app pnpm prisma studio
```

## Optional workflow: Node.js on the host

```bash
cp .env.example .env
docker compose up db -d
pnpm install
pnpm prisma:generate
pnpm dev
```

In this workflow, `DATABASE_URL` uses `localhost:5432` as supplied by `.env.example`.

## Useful commands

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm docker:up
pnpm docker:down
```

## Architecture and team conventions

Request flow is: Router → Middleware → Controller → Service → Repository → Prisma → PostgreSQL.

1. Routers only declare routes and attach middleware/controllers.
2. Controllers only adapt HTTP requests and invoke services.
3. Services contain business logic.
4. Services may call repositories.
5. Repositories own Prisma and database access.
6. Modules communicate through another module's service, never its repository.
7. Zod validates HTTP input.
8. Services validate business rules.
9. PostgreSQL constraints enforce critical data invariants.
10. Do not add infrastructure or abstraction without a real requirement.

The initial health module is the only implemented feature. HRMS domain models, migrations, authentication, and business modules are intentionally deferred.

## API documentation

Zod schemas and route metadata are the API contract. Swagger JSDoc, checked-in OpenAPI files, and source scanning are not used.

To add an endpoint:

1. Define or update the module's Zod request and response schemas.
2. Implement the repository, service, and controller.
3. Declare the endpoint once with `defineRoute()` in the module router, including its method, path, tags, summary, response schemas, optional middleware, and optional `security: [{ bearerAuth: [] }]`.

`defineRoute()` registers the Express route, runs the existing Zod validation middleware, and adds the same operation to the single OpenAPI registry. The document is generated once after application routes are mounted. With the configured `/api/v1` OpenAPI server, route metadata uses paths such as `/health`, never `/api/v1/health`.

Swagger UI includes the `bearerAuth` JWT scheme and preserves an entered authorization token while browsing. Use its **Authorize** button to provide a Bearer token for future authenticated routes.
