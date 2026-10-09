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

/**
 * @swagger
 * /goals:
 *   get:
 *     summary: List all career goals
 *     description: Returns all career goals for the authenticated user, with active goals listed first.
 *     tags: [Career Goals]
 *     responses:
 *       200:
 *         description: Career goals retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", asyncHandler(goalController.getGoals));

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Create a new career goal
 *     description: Adds a new career goal with target role, industry, location, and priority.
 *     tags: [Career Goals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetRole
 *             properties:
 *               targetRole:
 *                 type: string
 *                 example: Senior Backend Architect
 *               goalType:
 *                 type: string
 *                 example: Short-term
 *               targetIndustry:
 *                 type: string
 *                 example: Fintech
 *               targetLocation:
 *                 type: string
 *                 example: Remote / London
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: HIGH
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, ACHIEVED, ABANDONED]
 *                 example: ACTIVE
 *     responses:
 *       201:
 *         description: Career goal created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  createGoalValidator,
  validate,
  asyncHandler(goalController.createGoal),
);

/**
 * @swagger
 * /goals/{id}:
 *   put:
 *     summary: Update a career goal
 *     description: Updates an existing career goal. Only the owner can modify their goals.
 *     tags: [Career Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetRole:
 *                 type: string
 *               targetIndustry:
 *                 type: string
 *               targetLocation:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, ACHIEVED, ABANDONED]
 *     responses:
 *       200:
 *         description: Career goal updated successfully
 *       404:
 *         description: Goal not found or not owned by user
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  updateGoalValidator,
  validate,
  asyncHandler(goalController.updateGoal),
);

/**
 * @swagger
 * /goals/{id}:
 *   delete:
 *     summary: Delete a career goal
 *     description: Permanently removes a career goal. Only the owner can delete.
 *     tags: [Career Goals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Goal ID
 *     responses:
 *       200:
 *         description: Career goal deleted successfully
 *       404:
 *         description: Goal not found or not owned by user
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  goalIdParamValidator,
  validate,
  asyncHandler(goalController.deleteGoal),
);

export default router;
