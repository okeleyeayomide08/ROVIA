import { Router } from "express";
import * as certificationController from "./certification.controller.js";
import {
  createCertificationValidator,
  updateCertificationValidator,
  certificationIdParamValidator,
} from "./certification.validator.js";
import authenticate from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

// Require authentication for all certification endpoints
router.use(authenticate);

router.get("/", asyncHandler(certificationController.getCertifications));

router.post(
  "/",
  createCertificationValidator,
  validate,
  asyncHandler(certificationController.createCertification),
);

router.put(
  "/:id",
  updateCertificationValidator,
  validate,
  asyncHandler(certificationController.updateCertification),
);

router.delete(
  "/:id",
  certificationIdParamValidator,
  validate,
  asyncHandler(certificationController.deleteCertification),
);

export default router;
