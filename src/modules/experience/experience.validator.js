import { body, param } from 'express-validator';

export const createExperienceValidator = [
  body('company').notEmpty().withMessage('Company is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('startDate').isISO8601().toDate().withMessage('Valid start date is required'),
  body('endDate').optional({ nullable: true }).isISO8601().toDate().withMessage('Valid end date is required'),
  body('description').optional().isString()
];

export const updateExperienceValidator = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  body('company').optional().notEmpty(),
  body('position').optional().notEmpty(),
  body('startDate').optional().isISO8601().toDate(),
  body('endDate').optional({ nullable: true }).isISO8601().toDate(),
  body('description').optional().isString()
];

export const idParamValidator = [
  param('id').isMongoId().withMessage('Invalid ID format')
];