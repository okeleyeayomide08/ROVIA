import { body, param } from 'express-validator';

export const createSkillValidator = [
  body('name').notEmpty().trim().withMessage('Skill name is required'),
  body('proficiencyLevel')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .withMessage('Invalid proficiency level')
];

export const updateSkillValidator = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  body('name').optional().notEmpty().trim(),
  body('proficiencyLevel')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
];

export const idParamValidator = [
  param('id').isMongoId().withMessage('Invalid ID format')
];