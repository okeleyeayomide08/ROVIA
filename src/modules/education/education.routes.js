import { Router } from "express";
import * as educationController from "./education.controller.js";
import {
  createEducationValidator,
  updateEducationValidator,
  educationIdParamValidator,
} from "./education.validator.js";
import authenticate from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /profile/education:
 *   get:
 *     summary: List all education records
 *     description: Returns all education records for the authenticated user.
 *     tags: [Education]
 *     responses:
 *       200:
 *         description: Education records retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", asyncHandler(educationController.getEducations));

/**
 * @swagger
 * /profile/education:
 *   post:
 *     summary: Add education record
 *     description: Creates a new education record linked to the authenticated user.
 *     tags: [Education]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - institution
 *               - qualification
 *               - fieldOfStudy
 *             properties:
 *               institution:
 *                 type: string
 *                 example: University of Lagos
 *               qualification:
 *                 type: string
 *                 example: B.Sc Computer Science
 *               fieldOfStudy:
 *                 type: string
 *                 example: Computer Science
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2018-09-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2022-06-30"
 *               country:
 *                 type: string
 *                 example: Nigeria
 *     responses:
 *       201:
 *         description: Education record created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  createEducationValidator,
  validate,
  asyncHandler(educationController.createEducation),
);

/**
 * @swagger
 * /profile/education/{id}:
 *   put:
 *     summary: Update education record
 *     description: Updates an existing education record. Only the owner can update.
 *     tags: [Education]
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
 *               institution:
 *                 type: string
 *               qualification:
 *                 type: string
 *               fieldOfStudy:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Education record updated successfully
 *       404:
 *         description: Not found or not owned by user
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  updateEducationValidator,
  validate,
  asyncHandler(educationController.updateEducation),
);

/**
 * @swagger
 * /profile/education/{id}:
 *   delete:
 *     summary: Delete education record
 *     description: Permanently removes an education record. Only the owner can delete.
 *     tags: [Education]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Education record deleted successfully
 *       404:
 *         description: Not found or not owned by user
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  educationIdParamValidator,
  validate,
  asyncHandler(educationController.deleteEducation),
);

export default router;
