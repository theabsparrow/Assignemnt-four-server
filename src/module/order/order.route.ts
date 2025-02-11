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

router.get(
  '/all-orders',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  orderController.getAllOrder,
);
router.get('/my-orders', auth(USER_ROLE.user), orderController.getMyOwnOrders);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  orderController.getASingleOrder,
);
router.delete(
  '/delete-order/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  orderController.deleteOrder,
);
router.patch(
  '/delete-myOrder/:id',
  auth(USER_ROLE.user),
  orderController.deleteMyOwnOrder,
);
router.delete(
  '/delete-myOrders',
  auth(USER_ROLE.user),
  orderController.deleteAllOrders,
);
export const orderRoute = router;
