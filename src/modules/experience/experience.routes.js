import { Router } from 'express';
import experienceController from './experience.controller.js';
import { 
  createExperienceValidator, 
  updateExperienceValidator, 
  idParamValidator 
} from './experience.validator.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

router.use(authenticate);

router.route('/')
  .post(createExperienceValidator, validate, asyncHandler((req, res) => experienceController.create(req, res)))
  .get(asyncHandler((req, res) => experienceController.getAll(req, res)));

router.route('/:id')
  .get(idParamValidator, validate, asyncHandler((req, res) => experienceController.getById(req, res)))
  .put(updateExperienceValidator, validate, asyncHandler((req, res) => experienceController.update(req, res)))
  .delete(idParamValidator, validate, asyncHandler((req, res) => experienceController.delete(req, res)));

export default router;