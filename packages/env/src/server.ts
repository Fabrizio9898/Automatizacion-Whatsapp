import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    CORS_ORIGIN: z.string().optional().default("http://localhost:3001"),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    JWT_SECRET: z
      .string()
      .min(10, "El secreto JWT debe tener al menos 10 caracteres"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
