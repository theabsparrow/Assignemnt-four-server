import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { blogValidation } from './blog.validation';
import { auth } from '../../middlewire/auth';
import { USER_ROLE } from '../users/user.constant';
import { blogController } from './blog.controller';

const router = Router();

router.post(
  '/create-blog',
  validateRequest(blogValidation.blogValidationSchema),
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  blogController.createBlog,
);
router.get('/all-blogs', blogController.getAllBlogs);
router.get('/single-blog/:id', blogController.getASingleBlog);
router.get(
  '/get-myBlogs',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  blogController.getMyBlogs,
);
router.get(
  '/my-blog/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  blogController.getMySingleBlog,
);
router.patch(
  '/update-myBlog',
  validateRequest(blogValidation.updateBlogValidationSchema),
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  blogController.updateMyBlog,
);
router.delete(
  '/delete-myBlog/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  blogController.deleteMyBlog,
);
router.delete(
  'delete-blog/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  blogController.deleteBlog,
);
export const blogRoute = router;
