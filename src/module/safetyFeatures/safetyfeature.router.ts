import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { safetyFeatureValidation } from './safetyFeature.validation';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';
import { safetyFeatireController } from './afetyFeature.controller';

const router = Router();
router.patch(
  '/update-safety-feature/:id',
  validateRequest(safetyFeatureValidation.updateSafetyFeatureValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  safetyFeatireController.updateSafetyFeature,
);

export const safetyFeatureRouter = router;
