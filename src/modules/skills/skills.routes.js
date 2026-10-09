import { Router } from "express";
import * as skillsController from "./skills.controller.js";
import {
  addSkillValidator,
  updateSkillValidator,
  skillIdParamValidator,
} from "./skills.validator.js";
import authenticate from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

/**
 * @swagger
 * /skills:
 *   get:
 *     summary: Browse master skills catalog
 *     description: Returns all available skills with optional search. Used to populate skill selectors in the UI.
 *     tags: [Skills]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term for filtering skills by name
 *         example: javascript
 *     responses:
 *       200:
 *         description: Skills catalog retrieved successfully
 */
router.get("/", asyncHandler(skillsController.getAllSkills));

/**
 * @swagger
 * /skills/my-skills:
 *   get:
 *     summary: Get user's skills
 *     description: Returns all skills associated with the authenticated user, including proficiency and evidence.
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: User skills retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/my-skills",
  authenticate,
  asyncHandler(skillsController.getUserSkills),
);

/**
 * @swagger
 * /skills/my-skills:
 *   post:
 *     summary: Add a skill to profile
 *     description: Adds a skill to the user's profile. Creates the skill in the master catalog if it doesn't exist.
 *     tags: [Skills]
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
 *                 example: Node.js
 *               category:
 *                 type: string
 *                 example: Backend
 *               proficiency:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, EXPERT]
 *                 example: ADVANCED
 *               evidence:
 *                 type: string
 *                 example: Built 10+ production APIs using Express and Sequelize
 *     responses:
 *       201:
 *         description: Skill added successfully
 *       409:
 *         description: Skill already added
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/my-skills",
  authenticate,
  addSkillValidator,
  validate,
  asyncHandler(skillsController.addUserSkill),
);

/**
 * @swagger
 * /skills/my-skills/{skillId}:
 *   put:
 *     summary: Update skill proficiency or evidence
 *     description: Updates the proficiency level or evidence for a skill on the user's profile.
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: skillId
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
 *               proficiency:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, EXPERT]
 *               evidence:
 *                 type: string
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       404:
 *         description: Skill not associated with user
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/my-skills/:skillId",
  authenticate,
  updateSkillValidator,
  validate,
  asyncHandler(skillsController.updateUserSkill),
);

/**
 * @swagger
 * /skills/my-skills/{skillId}:
 *   delete:
 *     summary: Remove a skill from profile
 *     description: Removes the association between the user and a specific skill.
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Skill removed successfully
 *       404:
 *         description: Skill not associated with user
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/my-skills/:skillId",
  authenticate,
  skillIdParamValidator,
  validate,
  asyncHandler(skillsController.removeUserSkill),
);

export default router;
