import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { registrationDataValidation } from './registrationData.validation';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';
import { registrationController } from './registrationData.controller';

const router = Router();
router.patch(
  '/update-registrationData/:id',
  validateRequest(
    registrationDataValidation.updateRegistrationDataValidationSchema,
  ),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  registrationController.updateRegistrationData,
);

export const registrationdataRouter = router;
