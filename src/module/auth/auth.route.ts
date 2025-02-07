import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';

const router = Router();
router.post(
  '/login',
  validateRequest(authValidation.loginValidationSchema),
  authController.login,
);

export const authRoute = router;
