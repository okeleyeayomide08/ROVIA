import { Router } from "express";
import * as experienceController from "./experience.controller.js";
import {
  createExperienceValidator,
  updateExperienceValidator,
  experienceIdParamValidator,
} from "./experience.validator.js";
import authenticate from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /profile/experience:
 *   get:
 *     summary: List all experiences
 *     description: Returns all work, internship, project, and volunteer experiences for the authenticated user.
 *     tags: [Experience]
 *     responses:
 *       200:
 *         description: Experiences retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", asyncHandler(experienceController.getExperiences));

/**
 * @swagger
 * /profile/experience:
 *   post:
 *     summary: Add experience
 *     description: Creates a new experience record (work, internship, project, volunteering, or other).
 *     tags: [Experience]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organisation
 *               - title
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [WORK, INTERNSHIP, PROJECT, VOLUNTEERING, OTHER]
 *                 example: WORK
 *               organisation:
 *                 type: string
 *                 example: Rovia Technologies
 *               title:
 *                 type: string
 *                 example: Backend Engineer
 *               description:
 *                 type: string
 *                 example: Built scalable APIs using Node.js and PostgreSQL.
 *               location:
 *                 type: string
 *                 example: Lagos
 *               country:
 *                 type: string
 *                 example: Nigeria
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-01-15"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *               isCurrent:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Experience created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  createExperienceValidator,
  validate,
  asyncHandler(experienceController.createExperience),
);

/**
 * @swagger
 * /profile/experience/{id}:
 *   put:
 *     summary: Update experience
 *     description: Updates an existing experience record. Only the owner can update.
 *     tags: [Experience]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [WORK, INTERNSHIP, PROJECT, VOLUNTEERING, OTHER]
 *               organisation:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               country:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               isCurrent:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Experience updated successfully
 *       404:
 *         description: Not found or not owned by user
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  updateExperienceValidator,
  validate,
  asyncHandler(experienceController.updateExperience),
);

/**
 * @swagger
 * /profile/experience/{id}:
 *   delete:
 *     summary: Delete experience
 *     description: Permanently removes an experience record. Only the owner can delete.
 *     tags: [Experience]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Experience deleted successfully
 *       404:
 *         description: Not found or not owned by user
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  experienceIdParamValidator,
  validate,
  asyncHandler(experienceController.deleteExperience),
);

export default router;
