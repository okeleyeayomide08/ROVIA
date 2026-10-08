import { Router } from "express";
import * as goalController from "./goal.controller.js";
import {
  createGoalValidator,
  updateGoalValidator,
  goalIdParamValidator,
} from "./goal.validator.js";
import authenticate from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(goalController.getGoals));

router.post(
  "/",
  createGoalValidator,
  validate,
  asyncHandler(goalController.createGoal),
);

router.put(
  "/:id",
  updateGoalValidator,
  validate,
  asyncHandler(goalController.updateGoal),
);

router.delete(
  "/:id",
  goalIdParamValidator,
  validate,
  asyncHandler(goalController.deleteGoal),
);

export default router;
