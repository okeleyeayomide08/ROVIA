import { body, param } from "express-validator";

export const createCertificationValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Certification name is required")
    .isLength({ max: 255 })
    .withMessage("Name cannot exceed 255 characters"),

  body("issuer")
    .trim()
    .notEmpty()
    .withMessage("Issuer is required")
    .isLength({ max: 255 })
    .withMessage("Issuer cannot exceed 255 characters"),

  body("issueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Issue date must be a valid ISO8601 date (YYYY-MM-DD)"),

  body("expiryDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Expiry date must be a valid ISO8601 date (YYYY-MM-DD)"),

  body("credentialId")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Credential ID cannot exceed 255 characters"),

  body("credentialUrl")
    .optional({ nullable: true })
    .trim()
    .isURL()
    .withMessage("Credential URL must be a valid URL")
    .isLength({ max: 500 })
    .withMessage("Credential URL cannot exceed 500 characters"),
];

export const updateCertificationValidator = [
  param("id").isUUID().withMessage("Invalid certification ID format"),

  ...createCertificationValidator.map((rule) => rule.optional()),
];

export const certificationIdParamValidator = [
  param("id").isUUID().withMessage("Invalid certification ID format"),
];
