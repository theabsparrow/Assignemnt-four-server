import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { userValidation } from './user.validation';
import { userController } from './user.controller';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from './user.constant';

const router = Router();

router.post(
  '/register',
  validateRequest(userValidation.userValidationSchema),
  userController.createUSer,
);
router.get('/', auth(USER_ROLE.user), userController.getAllUsers);
router.get('/:id', userController.getASingleUSer);
router.patch(
  '/change-status/:id',
  validateRequest(userValidation.userStatusValidationSchema),
  userController.updateUserStatus,
);
router.delete('/:id', userController.deleteUser);
router.patch(
  '/update-role',
  validateRequest(userValidation.userRoleValidationSchema),
  userController.makeAdmin,
);
export const userRoute = router;
