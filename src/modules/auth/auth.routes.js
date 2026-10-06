import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "./auth.controller.js";
import {
  registerValidator,
  loginValidator,
  refreshValidator,
} from "./auth.validator.js";
import validate from "../../middleware/validate.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message:
        "Too many authentication attempts. Please try again in 15 minutes.",
    },
  },
});

router.post(
  "/register",
  authLimiter,
  registerValidator,
  validate,
  asyncHandler(authController.register),
);

router.post(
  "/login",
  authLimiter,
  loginValidator,
  validate,
  asyncHandler(authController.login),
);

router.post(
  "/refresh",
  refreshValidator,
  validate,
  asyncHandler(authController.refresh),
);

router.post("/logout", asyncHandler(authController.logout));

export default router;
