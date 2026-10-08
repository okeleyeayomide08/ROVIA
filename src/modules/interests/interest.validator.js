import { body, param, query } from "express-validator";

export const syncInterestsValidator = [
  body("interests")
    .isArray({ min: 0 })
    .withMessage("Interests must be an array of strings or UUIDs"),

  body("interests.*")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each interest must be a non-empty string")
    .isLength({ max: 100 })
    .withMessage("Interest name cannot exceed 100 characters"),
];

export const addInterestValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Interest name is required")
    .isLength({ max: 100 })
    .withMessage("Interest name cannot exceed 100 characters"),

  body("category")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Category cannot exceed 100 characters"),
];

export const interestIdParamValidator = [
  param("interestId").isUUID().withMessage("Invalid interest ID format"),
];

export const searchInterestsValidator = [
  query("query").optional().trim().isLength({ max: 100 }),
];
