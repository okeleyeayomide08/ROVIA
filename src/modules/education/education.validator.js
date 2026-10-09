import { body, param } from 'express-validator';

export const createEducationValidator = [
  body('school').notEmpty().withMessage('School is required'),
  body('degree').notEmpty().withMessage('Degree is required'),
  body('fieldOfStudy').notEmpty().withMessage('Field of study is required'),
  body('startDate').isISO8601().toDate().withMessage('Valid start date is required'),
  body('endDate').optional({ nullable: true }).isISO8601().toDate().withMessage('Valid end date is required')
];

export const updateEducationValidator = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  body('school').optional().notEmpty(),
  body('degree').optional().notEmpty(),
  body('fieldOfStudy').optional().notEmpty(),
  body('startDate').optional().isISO8601().toDate(),
  body('endDate').optional({ nullable: true }).isISO8601().toDate()
];

export const idParamValidator = [
  param('id').isMongoId().withMessage('Invalid ID format')
];