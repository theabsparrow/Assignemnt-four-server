import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';
import { resetAuth } from '../../middlewire/resetAuth';
import { resetRefresh } from '../../middlewire/resetRefresh';

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
router.post('/clear-token', authController.clearToken);
router.get(
  '/get-user',
  resetAuth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.getUser,
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
  '/retrive-password',
  validateRequest(authValidation.forgetPasswordValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.retrivePassword,
);
router.post(
  '/otp-resend',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.otpResend,
);
router.post(
  '/match-otp',
  validateRequest(authValidation.resetPasswordValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.matchOtp,
);
router.post(
  '/update-newPassword',
  validateRequest(authValidation.setNewPasswordValidationSchema),
  resetRefresh(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.updateNewPassword,
);
router.post('/send-otp/:id', authController.sendOTP);
router.post(
  '/reset-password',
  validateRequest(authValidation.resetPasswordValidationSchema),
  resetAuth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.resetPassword,
);
router.post(
  '/set-newPassword',
  validateRequest(authValidation.setNewPasswordValidationSchema),
  resetAuth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.setNewPassword,
);
export const authRoute = router;
