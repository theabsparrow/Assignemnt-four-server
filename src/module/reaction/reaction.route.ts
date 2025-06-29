import { Router } from 'express';
import { reactionController } from './reaction.controller';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';

const router = Router();
router.get(
  '/my-reaction/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  reactionController.getMyReaction,
);
export const reactionRoute = router;
