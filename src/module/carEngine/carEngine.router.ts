import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { engineInfoValidation } from './carEngine.validation';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';
import { carEngineController } from './carEngineController';

const router = Router();
router.patch(
  '/update-carEngine/:id',
  validateRequest(engineInfoValidation.updateEngineInfoValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  carEngineController.updateCarEngine,
);

export const carEngineRouter = router;
