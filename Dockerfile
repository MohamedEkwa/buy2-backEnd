FROM node:24-bookworm-slim AS base

WORKDIR /app
ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/buy2_hrms
RUN apt-get update \
  && apt-get install --no-install-recommends -y openssl \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable \
  && corepack prepare pnpm@10.33.0 --activate

FROM base AS dependencies

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS development

COPY . .
RUN pnpm prisma:generate
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM dependencies AS build

COPY . .
RUN pnpm prisma:generate && pnpm build && pnpm prune --prod

FROM node:24-bookworm-slim AS production

WORKDIR /app
ENV NODE_ENV=production
RUN groupadd --system app && useradd --system --gid app app
COPY --from=build --chown=app:app /app/package.json ./package.json
COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/dist ./dist
USER app
EXPOSE 3000
CMD ["node", "dist/server.js"]
