import { Router } from "express";
import * as profileController from "./profile.controller.js";
import { updateProfileValidator } from "./profile.validator.js";
import authenticate from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

// Protect ALL profile routes with authentication middleware
router.use(authenticate);

router.get("/", asyncHandler(profileController.getProfile));

router.put(
  "/",
  updateProfileValidator,
  validate,
  asyncHandler(profileController.updateProfile),
);

export default router;
