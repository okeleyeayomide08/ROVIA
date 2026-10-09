import pino from "pino";
import env from "./env.js";

const logger = pino({
  level: env.logLevel,
  // Automatically mask sensitive PII fields if they appear anywhere in logged objects
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.password",
      "req.body.refreshToken",
      "req.body.token",
      "password",
      "passwordHash",
      "refreshToken",
      "tokenHash",
    ],
    censor: "[REDACTED]",
  },
  transport:
    env.nodeEnv === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});

export default logger;
