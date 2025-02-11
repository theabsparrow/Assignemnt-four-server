import { Router } from 'express';
import { orderController } from './order.controller';
import validateRequest from '../../middlewire/validateRequest';
import { orderValidation } from './order.validation';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';

const router = Router();

router.post(
  '/create-order',
  validateRequest(orderValidation.orderValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  orderController.createOrder,
);

export const orderRoute = router;
