import { Router } from 'express';
import { carController } from './car.controller';
import validateRequest from '../../middlewire/validateRequest';
import { carValidation } from './car.validation';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';
import { engineInfoValidation } from '../carEngine/carEngine.validation';
import { carEngineController } from '../carEngine/carEngineController';
import { registrationDataValidation } from '../registrationData/registrationData.validation';
import { registrationController } from '../registrationData/registrationData.controller';
import { serviceHistoryValidation } from '../serviceHistory/serviceHistory.validation';
import { serviceHistoryController } from '../serviceHistory/serviceHistory.controller';
import { safetyFeatureValidation } from '../safetyFeatures/safetyFeature.validation';
import { safetyFeatireController } from '../safetyFeatures/afetyFeature.controller';

const router = Router();

router.post(
  '/create-car',
  validateRequest(carValidation.carValidationSchema),
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  carController.createCar,
);
router.get('/get-allCars', carController.getAllCars);
router.get(
  '/all-carsList',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  carController.getAllCarList,
);
router.get(
  '/my-cars',
  auth(USER_ROLE.admin, USER_ROLE.user),
  carController.getMyCars,
);
router.get('/get-models', carController.getModelsByBrand);
router.get('/get-categories', carController.getCarCategories);
router.get('/get-brands', carController.getCarBrands);
router.get(
  '/checkout/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  carController.getCheckoutCar,
);
router.get(
  '/myCars/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  carController.getMySIngleCar,
);
router.get('/:id', carController.getSingleCar);
router.patch(
  '/update-info/:id',
  validateRequest(carValidation.updateCArInfoValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  carController.updatCarInfo,
);
router.patch(
  '/update-carEngine/:id',
  validateRequest(engineInfoValidation.updateEngineInfoValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  carEngineController.updateCarEngine,
);
router.patch(
  '/update-registrationData/:id',
  validateRequest(
    registrationDataValidation.updateRegistrationDataValidationSchema,
  ),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  registrationController.updateRegistrationData,
);
router.patch(
  '/update-service-history/:id',
  validateRequest(
    serviceHistoryValidation.updateServiceHistoryValidationSchema,
  ),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  serviceHistoryController.updateServiceHistory,
);
router.patch(
  '/update-safety-feature/:id',
  validateRequest(safetyFeatureValidation.updateSafetyFeatureValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  safetyFeatireController.updateSafetyFeature,
);

router.delete(
  '/delete/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  carController.deleteCar,
);

export const carRoute = router;
