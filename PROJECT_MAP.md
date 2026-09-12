# Project Map: buy2-backEnd (HRMS API)

## Overview
- **Name:** buy2-hrms-api
- **Runtime:** Node.js (>=24.0.0), TypeScript, Express 5
- **Package Manager:** pnpm (v10+)
- **ORM / Database:** Prisma 7 + PostgreSQL (@prisma/adapter-pg, pg)
- **Validation / Documentation:** Zod v4, @asteasolutions/zod-to-openapi, swagger-ui-express
- **Testing:** Vitest, Supertest

## Directory Structure
```
/Users/o/Desktop/شغل/buy2/buy2-backEnd
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Main Prisma schema file
│   └── migrations/       # DB migration files
├── src/                  # Source code
│   ├── config/           # Configuration & environment setup
│   ├── database/         # Prisma client instance & DB connections
│   ├── middleware/       # Express middlewares (error handling, validation, 404)
│   ├── modules/          # Feature-based modules (e.g., job positions, etc.)
│   │   └── job/          # Job Position module (router, controller, service, repository, schema, types)
│   ├── shared/           # Shared utilities (errors, HTTP route definition wrappers)
│   ├── app.ts            # Express application setup
│   ├── server.ts         # Server entry point
│   └── *.test.ts         # Integration & unit tests
├── Dockerfile            # Container configuration
├── compose.yml           # Docker Compose setup
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Key Commands
- **Dev mode:** `pnpm dev`
- **Build:** `pnpm build`
- **Type check:** `pnpm typecheck`
- **Run tests:** `pnpm test`
- **Prisma Generate:** `pnpm prisma:generate`
- **Prisma Migrate:** `pnpm prisma:migrate`
