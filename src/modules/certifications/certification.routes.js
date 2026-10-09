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

router.use(authenticate);

/**
 * @swagger
 * /profile/certifications:
 *   get:
 *     summary: List all certifications
 *     description: Returns all certifications belonging to the authenticated user, ordered by issue date.
 *     tags: [Certifications]
 *     responses:
 *       200:
 *         description: Certifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", asyncHandler(certificationController.getCertifications));

/**
 * @swagger
 * /profile/certifications:
 *   post:
 *     summary: Add a new certification
 *     description: Creates a certification record linked to the authenticated user.
 *     tags: [Certifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - issuer
 *             properties:
 *               name:
 *                 type: string
 *                 example: AWS Certified Solutions Architect
 *               issuer:
 *                 type: string
 *                 example: Amazon Web Services
 *               issueDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: "2027-01-15"
 *               credentialId:
 *                 type: string
 *                 example: AWS-SAA-2024-12345
 *               credentialUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://aws.amazon.com/verification
 *     responses:
 *       201:
 *         description: Certification created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  createCertificationValidator,
  validate,
  asyncHandler(certificationController.createCertification),
);

/**
 * @swagger
 * /profile/certifications/{id}:
 *   put:
 *     summary: Update a certification
 *     description: Updates an existing certification. Only the owner can update their own records.
 *     tags: [Certifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Certification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               issuer:
 *                 type: string
 *               issueDate:
 *                 type: string
 *                 format: date
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               credentialId:
 *                 type: string
 *               credentialUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Certification updated successfully
 *       404:
 *         description: Certification not found or not owned by user
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  updateCertificationValidator,
  validate,
  asyncHandler(certificationController.updateCertification),
);

/**
 * @swagger
 * /profile/certifications/{id}:
 *   delete:
 *     summary: Delete a certification
 *     description: Permanently removes a certification record. Only the owner can delete.
 *     tags: [Certifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Certification ID
 *     responses:
 *       200:
 *         description: Certification deleted successfully
 *       404:
 *         description: Certification not found or not owned by user
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  certificationIdParamValidator,
  validate,
  asyncHandler(certificationController.deleteCertification),
);

export default router;
