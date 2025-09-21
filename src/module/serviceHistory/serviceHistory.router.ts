import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { serviceHistoryValidation } from './serviceHistory.validation';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';
import { serviceHistoryController } from './serviceHistory.controller';

const router = Router();
router.patch(
  '/update-service-history/:id',
  validateRequest(
    serviceHistoryValidation.updateServiceHistoryValidationSchema,
  ),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  serviceHistoryController.updateServiceHistory,
);

export const serviceHistoryRouter = router;
