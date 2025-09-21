import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { deliveryAndPaymentValidation } from './carDelivery.validation';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';
import { carDeliveryController } from './carDelivery.controller';

const router = Router();
router.patch(
  '/updateDelivery/:id',
  validateRequest(
    deliveryAndPaymentValidation.updateDeliveryAndPaymentValidatonSchema,
  ),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  carDeliveryController.updateCarDeliveryInfo,
);

export const carDeliveryRouter = router;
