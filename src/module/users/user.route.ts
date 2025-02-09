import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { userValidation } from './user.validation';
import { userController } from './user.controller';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from './user.constant';

const router = Router();

router.post(
  '/register',
  auth(USER_ROLE.superAdmin),
  validateRequest(userValidation.userValidationSchema),
  userController.createUSer,
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.getAllUsers,
);
router.get(
  '/my-profile',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.getMe,
);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.getASingleUSer,
);
router.patch(
  '/change-status/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(userValidation.userStatusValidationSchema),
  userController.updateUserStatus,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.deleteUser,
);
router.patch(
  '/update-role/:id',
  auth(USER_ROLE.superAdmin),
  validateRequest(userValidation.userRoleValidationSchema),
  userController.makeAdmin,
);
router.patch(
  '/update-info',
  validateRequest(userValidation.updateUserInfoValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.updateUserInfo,
);
router.delete(
  '/delete-account',
  validateRequest(userValidation.accountDelationValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.deleteAccount,
);
export const userRoute = router;
