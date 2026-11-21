import dotenv from "dotenv";

dotenv.config();

const requiredVars = [
  "NODE_ENV",
  "PORT",
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_ACCESS_EXPIRES_IN",
  "JWT_REFRESH_EXPIRES_IN",
];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

export default {
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  // Transactional email via Brevo's HTTPS API (works on hosts that block SMTP ports).
  email: {
    brevoApiKey: process.env.BREVO_API_KEY || "",
    // Must be a sender address verified in Brevo, e.g. "Rovia <noreply@yourdomain.com>"
    from: process.env.EMAIL_FROM || "",
  },
  storage: {
    endpoint: process.env.STORAGE_ENDPOINT || "",
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || "",
    bucketName: process.env.STORAGE_BUCKET_NAME || "rovia-documents",
    region: process.env.STORAGE_REGION || "us-west-004",
  },
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  logLevel: process.env.LOG_LEVEL || "info",
  cookie: {
    secure:
      process.env.COOKIE_SECURE === "true" ||
      process.env.NODE_ENV === "production",
    sameSite:
      process.env.COOKIE_SAME_SITE ||
      (process.env.NODE_ENV === "production" ? "none" : "lax"),
    domain: process.env.COOKIE_DOMAIN || undefined,
  },
};
