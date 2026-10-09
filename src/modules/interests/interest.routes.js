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

/**
 * @swagger
 * /interests:
 *   get:
 *     summary: Browse master interests catalog
 *     description: Returns all available interests with optional search filtering. Can be used to populate tag selectors in the UI.
 *     tags: [Interests]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term for filtering interests by name
 *         example: cloud
 *     responses:
 *       200:
 *         description: Interests catalog retrieved successfully
 */
router.get(
  "/",
  searchInterestsValidator,
  validate,
  asyncHandler(interestController.getAllInterests),
);

/**
 * @swagger
 * /interests/my-interests:
 *   get:
 *     summary: Get user's selected interests
 *     description: Returns all interests associated with the authenticated user's profile.
 *     tags: [Interests]
 *     responses:
 *       200:
 *         description: User interests retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/my-interests",
  authenticate,
  asyncHandler(interestController.getUserInterests),
);

/**
 * @swagger
 * /interests/my-interests:
 *   put:
 *     summary: Bulk sync user interests
 *     description: Replaces the user's entire interest list with the provided array. Creates any new interest names in the master catalog automatically.
 *     tags: [Interests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - interests
 *             properties:
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Cloud Architecture", "Distributed Systems", "Machine Learning"]
 *     responses:
 *       200:
 *         description: User interests updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/my-interests",
  authenticate,
  syncInterestsValidator,
  validate,
  asyncHandler(interestController.syncUserInterests),
);

/**
 * @swagger
 * /interests/my-interests:
 *   post:
 *     summary: Add a single interest
 *     description: Adds one interest to the user's profile. Creates the interest in the master catalog if it doesn't exist.
 *     tags: [Interests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cybersecurity
 *               category:
 *                 type: string
 *                 example: Technology
 *     responses:
 *       201:
 *         description: Interest added successfully
 *       409:
 *         description: Interest already associated with user
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/my-interests",
  authenticate,
  addInterestValidator,
  validate,
  asyncHandler(interestController.addUserInterest),
);

/**
 * @swagger
 * /interests/my-interests/{interestId}:
 *   delete:
 *     summary: Remove an interest from profile
 *     description: Removes the association between the user and a specific interest.
 *     tags: [Interests]
 *     parameters:
 *       - in: path
 *         name: interestId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Interest ID to remove
 *     responses:
 *       200:
 *         description: Interest removed successfully
 *       404:
 *         description: Interest not associated with user
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/my-interests/:interestId",
  authenticate,
  interestIdParamValidator,
  validate,
  asyncHandler(interestController.removeUserInterest),
);

export default router;
