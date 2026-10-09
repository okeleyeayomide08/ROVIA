import { body, param } from "express-validator";

const PROFICIENCY_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

export const addSkillValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Skill name is required")
    .isLength({ max: 100 })
    .withMessage("Skill name cannot exceed 100 characters"),

  body("category")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Category cannot exceed 100 characters"),

  body("proficiency")
    .optional()
    .isIn(PROFICIENCY_LEVELS)
    .withMessage(
      `Proficiency must be one of: ${PROFICIENCY_LEVELS.join(", ")}`,
    ),

  body("evidence")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Evidence cannot exceed 2000 characters"),
];

export const updateSkillValidator = [
  param("skillId").isUUID().withMessage("Invalid skill ID format"),

  body("proficiency")
    .optional()
    .isIn(PROFICIENCY_LEVELS)
    .withMessage(
      `Proficiency must be one of: ${PROFICIENCY_LEVELS.join(", ")}`,
    ),

  body("evidence").optional({ nullable: true }).trim().isLength({ max: 2000 }),
];

export const skillIdParamValidator = [
  param("skillId").isUUID().withMessage("Invalid skill ID format"),
];
