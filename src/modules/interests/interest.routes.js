import { Router } from "express";
import * as interestController from "./interest.controller.js";
import {
  syncInterestsValidator,
  addInterestValidator,
  interestIdParamValidator,
  searchInterestsValidator,
} from "./interest.validator.js";
import authenticate from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

// Master catalog endpoint (can be public or authenticated)
router.get(
  "/",
  searchInterestsValidator,
  validate,
  asyncHandler(interestController.getAllInterests),
);

// User-specific interest endpoints (require authentication)
router.get(
  "/my-interests",
  authenticate,
  asyncHandler(interestController.getUserInterests),
);

router.put(
  "/my-interests",
  authenticate,
  syncInterestsValidator,
  validate,
  asyncHandler(interestController.syncUserInterests),
);

router.post(
  "/my-interests",
  authenticate,
  addInterestValidator,
  validate,
  asyncHandler(interestController.addUserInterest),
);

router.delete(
  "/my-interests/:interestId",
  authenticate,
  interestIdParamValidator,
  validate,
  asyncHandler(interestController.removeUserInterest),
);

export default router;
