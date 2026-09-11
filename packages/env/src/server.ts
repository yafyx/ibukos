import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const isCloudflareWorker =
  typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

if (!isCloudflareWorker) {
  await import("dotenv/config");
}

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

