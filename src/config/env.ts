import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url("DATABASE_URL must be a valid PostgreSQL URL.").startsWith("postgresql://"),
  API_DOCS_ENABLED: z.stringbool().default(true),
});

export type Environment = z.infer<typeof envSchema>;

let environment: Environment | undefined;

export function getEnv(): Environment {
  if (environment) {
    return environment;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const messages = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${messages}`);
  }

  environment = parsed.data;
  return environment;
}
