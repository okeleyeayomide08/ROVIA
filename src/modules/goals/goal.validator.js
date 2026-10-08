import { body, param } from "express-validator";

export const createGoalValidator = [
  body("targetRole")
    .trim()
    .notEmpty()
    .withMessage("Target role is required")
    .isLength({ max: 255 })
    .withMessage("Target role cannot exceed 255 characters"),

  body("goalType")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Goal type cannot exceed 100 characters"),

  body("targetIndustry")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Target industry cannot exceed 255 characters"),

  body("targetLocation")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Target location cannot exceed 255 characters"),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Priority must be LOW, MEDIUM, or HIGH"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "ACHIEVED", "ABANDONED"])
    .withMessage("Status must be ACTIVE, ACHIEVED, or ABANDONED"),
];

export const updateGoalValidator = [
  param("id").isUUID().withMessage("Invalid goal ID format"),

  ...createGoalValidator.map((rule) => rule.optional()),
];

export const goalIdParamValidator = [
  param("id").isUUID().withMessage("Invalid goal ID format"),
];
