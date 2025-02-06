import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { userValidation } from './user.validation';
import { userController } from './user.controller';

const router = Router();

router.post(
  '/register',
  validateRequest(userValidation.userValidationSchema),
  userController.createUSer,
);
router.get('/', userController.getAllUsers);
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
