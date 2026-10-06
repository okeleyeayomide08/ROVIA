import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export function generateAccessToken(payload) {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

export function generateRefreshToken() {
  return crypto.randomBytes(40).toString("hex");
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
