import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { User } from '../users/user.model';
import { Blog } from '../blog/blog.model';
import { Reaction } from './reaction.model';

const getMyReaction = async (id: string, userEmail: string) => {
  const userInfo = await User.findOne({ email: userEmail }).select('name');
  if (!userInfo) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no user found to create a blog');
  }
  const userId = userInfo?._id;
  const isBlogExists = await Blog.findById(id).select('title');
  if (!isBlogExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'data not found');
  }
  const blogId = isBlogExists?._id;
  const result = await Reaction.findOne({ blogId, userId }).select('reaction');
  if (result) {
    return result;
  }
  return null;
};

export const reactionService = {
  getMyReaction,
};
