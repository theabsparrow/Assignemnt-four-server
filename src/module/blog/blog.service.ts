/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { TBlog, TExtendedBlog } from './blog.interface';
import { User } from '../users/user.model';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { Blog } from './blog.model';
import mongoose from 'mongoose';

const createBlog = async (user: JwtPayload, payload: TBlog) => {
  const { userEmail } = user;
  const userInfo = await User.findOne({ email: userEmail }).select('name');
  if (!userInfo) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no user found to create a blog');
  }
  payload.authorId = userInfo?._id;
  payload.name = `${userInfo?.name.firstName} ${userInfo?.name.lastName}`;
  const result = await Blog.create(payload);
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'falid to create the blog');
  }
  return result;
};

const getallBlogs = async (query: Record<string, unknown>) => {
  const result = await Blog.find({ status: 'published' });
  if (result.length < 1) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blogs found');
  }
  return result;
};

const getASingleBlog = async (id: string) => {
  const result = await Blog.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blog found');
  }
  if (result?.status === 'draft') {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blog found');
  }
  return result;
};

const getMyBlogs = async (
  userEmail: string,
  query: Record<string, unknown>,
) => {
  const userInfo = await User.findOne({ email: userEmail }).select('email');
  if (!userInfo) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no user found to create a blog');
  }
  const userId = userInfo?._id;
  const result = await Blog.find({ authorId: userId });
  if (result.length < 1) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blogs found');
  }
  return result;
};

const getMySingleBlog = async (userEmail: string, id: string) => {
  const userInfo = await User.findOne({ email: userEmail }).select('email');
  if (!userInfo) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no user found to create a blog');
  }
  const userId = userInfo?._id;
  const result = await Blog.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blog found');
  }
  if (result?.authorId.toString() !== userId.toString()) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'you are not authorized to view this blog',
    );
  }
  return result;
};

const updateMyBlog = async ({
  userEmail,
  id,
  payload,
}: {
  userEmail: string;
  id: string;
  payload: Partial<TExtendedBlog>;
}) => {
  const userInfo = await User.findOne({ email: userEmail }).select('email');
  if (!userInfo) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no user found to create a blog');
  }
  const userId = userInfo?._id;
  const BlogInfo = await Blog.findById(id);
  if (!BlogInfo) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blog found');
  }
  if (BlogInfo?.authorId.toString() !== userId.toString()) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'you are not authorized to update this blog',
    );
  }
  const { addTags, removeTags, ...remainingData } = payload;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updateRemainingData = await Blog.findByIdAndUpdate(
      id,
      remainingData,
      { session, new: true, runValidators: true },
    );
    if (!updateRemainingData) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to update data');
    }
    if (addTags && addTags.length > 0) {
      const updated = await Blog.findByIdAndUpdate(
        id,
        {
          $addToSet: { tags: { $each: addTags } },
        },
        { session, new: true, runValidators: true },
      );
      if (!updated) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to update data');
      }
    }
    if (removeTags && removeTags.length > 0) {
      const update = await Blog.findByIdAndUpdate(
        id,
        { $pull: { tags: { $in: removeTags } } },
        { session, new: true, runValidators: true },
      );
      if (!update) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to update data');
      }
    }
    await session.commitTransaction();
    await session.endSession();
    const result = await Blog.findById(id);
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

const deleteMyBlog = async (id: string, userEmail: string) => {
  const userInfo = await User.findOne({ email: userEmail }).select('email');
  if (!userInfo) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no user found to create a blog');
  }
  const userId = userInfo?._id;
  const BlogInfo = await Blog.findById(id);
  if (!BlogInfo) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blog found');
  }
  if (BlogInfo?.authorId.toString() !== userId.toString()) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'you are not authorized to delete this blog',
    );
  }
  const result = await Blog.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete the blog');
  }
  return null;
};

const deleteBlog = async (id: string) => {
  const existBlog = await Blog.findById(id).select('title');
  if (!existBlog) {
    throw new AppError(StatusCodes.NOT_FOUND, 'blog not found');
  }
  const result = await Blog.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete the blog');
  }
  return result;
};

export const blogService = {
  createBlog,
  getallBlogs,
  getASingleBlog,
  getMyBlogs,
  getMySingleBlog,
  deleteMyBlog,
  updateMyBlog,
  deleteBlog,
};
