import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { commentValidation } from './comment.validation';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';
import { commentController } from './comment.controller';

const router = Router();
router.post(
  '/create-comment/:id',
  validateRequest(commentValidation.commentValidationSchema),
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  commentController.createComment,
);
router.get('/getAllComment/:id', commentController.getAlComment);
router.get('/getAllReplies/:id', commentController.getAllReplies);
router.patch(
  '/update-comment/:id',
  validateRequest(commentValidation.updateCommentValidationSchema),
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  commentController.updateComment,
);
router.delete(
  '/delete-comment/:id',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  commentController.deleteComment,
);
export const commentRouter = router;
