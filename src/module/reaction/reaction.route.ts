import { Router } from 'express';
import { reactionController } from './reaction.controller';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';

const router = Router();
router.patch(
  '/create-reaction/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  reactionController.createReaction,
);
router.get(
  '/my-reaction/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  reactionController.getMyReaction,
);
router.patch(
  '/create-commentReaction/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  reactionController.createCommentReaction,
);
router.get(
  '/get-myReaction/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  reactionController.getMyCommentReaction,
);
export const reactionRoute = router;
