import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';

const router = Router();
router.post(
  '/login',
  validateRequest(authValidation.loginValidationSchema),
  authController.login,
);
router.post(
  '/change-password',
  validateRequest(authValidation.changePassowrdValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.changePassword,
);
router.post(
  '/access-token',
  validateRequest(authValidation.accessTokenGeneratorValidationSchema),
  authController.generateAccessToken,
);
router.post(
  '/forget-password',
  validateRequest(authValidation.forgetPasswordValidationSchema),
  authController.forgetPassword,
);

export const authRoute = router;
