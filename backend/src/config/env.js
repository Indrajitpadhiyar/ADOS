import dotenv from "dotenv";
import { z } from "zod";

// Load .env variables
dotenv.config();

// Schema definition for strict environment variable validation
const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGO_URL: z.string().min(1, "MONGO_URL is required"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 characters long"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 characters long"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  COOKIE_SECRET: z.string().min(16, "COOKIE_SECRET must be at least 16 characters long"),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("ADOS <onboarding@resend.dev>"),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  APP_URL: z.string().url("APP_URL must be a valid URL").default("http://localhost:5173"),
  EMAIL_VERIFICATION_EXPIRES_MINUTES: z.coerce.number().default(60),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Critical Environment Validation Failure:");
    result.error.issues.forEach((issue) => {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    });
    process.exit(1);
  }

  return Object.freeze(result.data);
};

export const env = parseEnv();
