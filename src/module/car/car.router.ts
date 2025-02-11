import { Router } from 'express';
import { carController } from './car.controller';
import validateRequest from '../../middlewire/validateRequest';
import { carValidation } from './car.validation';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';

const router = Router();

router.post(
  '/create-car',
  validateRequest(carValidation.carValidationSchema),
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  carController.createCar,
);

router.get('/get-allCars', carController.getAllCars);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  carController.getSingleCar,
);

router.patch(
  'update-info/:id',
  validateRequest(carValidation.updateCArInfoValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  carController.updatCarInfo,
);

router.patch(
  '/update-image/:id',
  validateRequest(carValidation.updateCarImageValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  carController.updatedCarImage,
);

router.patch(
  '/update-quantity/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  carController.updateQuantity,
);

router.delete(
  'delete/:id',
  validateRequest(carValidation.updateQuantityVAlidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  carController.deleteCar,
);

export const carRoute = router;
