import { body } from "express-validator";

export const updateProfileValidator = [
  body("headline")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Headline cannot exceed 255 characters"),

  body("location")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Location cannot exceed 255 characters"),

  body("country")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Country cannot exceed 100 characters"),

  body("careerLevel")
    .optional()
    .isIn(["STUDENT", "ENTRY_LEVEL", "MID_LEVEL", "SENIOR", "EXECUTIVE"])
    .withMessage(
      "Career level must be one of: STUDENT, ENTRY_LEVEL, MID_LEVEL, SENIOR, EXECUTIVE",
    ),

  body("biography")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Biography cannot exceed 2000 characters"),
];
