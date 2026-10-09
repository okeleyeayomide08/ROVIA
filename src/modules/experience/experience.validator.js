import { body, param } from "express-validator";

const EXPERIENCE_TYPES = [
  "WORK",
  "INTERNSHIP",
  "PROJECT",
  "VOLUNTEERING",
  "OTHER",
];

export const createExperienceValidator = [
  body("type")
    .optional()
    .isIn(EXPERIENCE_TYPES)
    .withMessage(`Type must be one of: ${EXPERIENCE_TYPES.join(", ")}`),

  body("organisation")
    .trim()
    .notEmpty()
    .withMessage("Organisation is required")
    .isLength({ max: 255 })
    .withMessage("Organisation cannot exceed 255 characters"),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title cannot exceed 255 characters"),

  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("location").optional({ nullable: true }).trim().isLength({ max: 255 }),

  body("country").optional({ nullable: true }).trim().isLength({ max: 100 }),

  body("startDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Start date must be a valid date (YYYY-MM-DD)"),

  body("endDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("End date must be a valid date (YYYY-MM-DD)"),

  body("isCurrent")
    .optional()
    .isBoolean()
    .withMessage("isCurrent must be true or false"),
];

export const updateExperienceValidator = [
  param("id").isUUID().withMessage("Invalid experience ID format"),

  body("type")
    .optional()
    .isIn(EXPERIENCE_TYPES)
    .withMessage(`Type must be one of: ${EXPERIENCE_TYPES.join(", ")}`),

  body("organisation")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Organisation cannot be empty")
    .isLength({ max: 255 }),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 255 }),

  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 2000 }),

  body("location").optional({ nullable: true }).trim().isLength({ max: 255 }),

  body("country").optional({ nullable: true }).trim().isLength({ max: 100 }),

  body("startDate").optional({ nullable: true }).isISO8601(),

  body("endDate").optional({ nullable: true }).isISO8601(),

  body("isCurrent").optional().isBoolean(),
];

export const experienceIdParamValidator = [
  param("id").isUUID().withMessage("Invalid experience ID format"),
];
