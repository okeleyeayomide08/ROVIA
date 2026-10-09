import { Router } from "express";
import * as profileController from "./profile.controller.js";
import { updateProfileValidator } from "./profile.validator.js";
import authenticate from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get complete aggregated career profile
 *     description: Returns the authenticated user's full profile including education, skills, experiences, certifications, career goals, interests, and completion score.
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     profile:
 *                       type: object
 *                     education:
 *                       type: array
 *                     skills:
 *                       type: array
 *                     experiences:
 *                       type: array
 *                     certifications:
 *                       type: array
 *                     careerGoals:
 *                       type: array
 *                     interests:
 *                       type: array
 *                     completion:
 *                       type: object
 *                       properties:
 *                         percentage:
 *                           type: integer
 *                           example: 65
 *                         status:
 *                           type: string
 *                           example: INCOMPLETE
 *                         missingSteps:
 *                           type: array
 *                           items:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.get("/", asyncHandler(profileController.getProfile));

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update core profile information
 *     description: Updates headline, location, country, career level, and biography. Automatically recalculates completion status.
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               headline:
 *                 type: string
 *                 example: Backend Engineer | Node.js Specialist
 *               location:
 *                 type: string
 *                 example: Lagos
 *               country:
 *                 type: string
 *                 example: Nigeria
 *               careerLevel:
 *                 type: string
 *                 enum: [STUDENT, ENTRY_LEVEL, MID_LEVEL, SENIOR, EXECUTIVE]
 *                 example: MID_LEVEL
 *               biography:
 *                 type: string
 *                 example: Passionate backend engineer building scalable systems.
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/",
  updateProfileValidator,
  validate,
  asyncHandler(profileController.updateProfile),
);

export default router;
