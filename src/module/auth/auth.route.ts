import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';
import { authReset } from '../../middlewire/authreset';

const router = Router();
router.post(
  '/login',
  validateRequest(authValidation.loginValidationSchema),
  authController.login,
);
router.post(
  '/logout',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.logout,
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
router.post(
  '/reset-password',
  validateRequest(authValidation.resetPasswordValidationSchema),
  authReset(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.resetPassword,
);
router.post(
  '/set-newPassword',
  validateRequest(authValidation.setNewPasswordValidationSchema),
  authReset(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.setNewPassword,
);
export const authRoute = router;
