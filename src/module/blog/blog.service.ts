/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { TBlog, TExtendedBlog } from './blog.interface';
import { User } from '../users/user.model';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { Blog } from './blog.model';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { blogSearchAbleFields } from './blog.const';
import { TReaction } from '../reaction/reaction.interface';
import { Reaction } from '../reaction/reaction.model';

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
  const filter: Record<string, unknown> = {};
  filter.isDeleted = false;
  filter.status = 'published';
  query = { ...query, ...filter };
  const blogQuery = new QueryBuilder(Blog.find(), query)
    .search(blogSearchAbleFields)
    .sort()
    .filter()
    .paginateQuery()
    .fields();
  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.countTotal();
  if (result.length < 1) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blogs found');
  }
  return { meta, result };
};

const getASingleBlog = async (id: string) => {
  const isBlogExists = await Blog.findById(id);
  if (!isBlogExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blog found');
  }
  if (isBlogExists?.status === 'draft') {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blog found');
  }
  await Blog.findByIdAndUpdate(id, { $inc: { view: 1 } }, { new: true });
  const result = await Blog.findById(id);
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
  const filter: Record<string, unknown> = {};
  filter.isDeleted = false;
  filter.authorId = userId;
  query = { ...query, ...filter };
  const blogQuery = new QueryBuilder(Blog.find(), query)
    .search(blogSearchAbleFields)
    .sort()
    .filter();
  const result = await blogQuery.modelQuery;
  if (result.length < 1) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blogs found');
  }
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

const countReaction = async ({
  userEmail,
  blogId,
  payload,
}: {
  userEmail: string;
  blogId: string;
  payload: TReaction;
}) => {
  const userInfo = await User.findOne({ email: userEmail }).select('name');
  if (!userInfo) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no user found to create a blog');
  }
  payload.userId = userInfo?._id;
  const isBlogExists = await Blog.findById(blogId).select('title');
  if (!isBlogExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'data not found');
  }
  const blog_id = isBlogExists?._id;
  payload.blogId = blog_id;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const reactionForThisUserOfThisBlogExists = await Reaction.findOne({
      blogId: isBlogExists?._id,
      userId: userInfo?._id,
    });
    const updateField = `reaction.${payload.reaction}`;
    if (!reactionForThisUserOfThisBlogExists) {
      const reactResult = await Blog.findByIdAndUpdate(
        blog_id,
        { $inc: { [updateField]: 1 } },
        { session, new: true, runValidators: true },
      );
      if (!reactResult) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
      const reactionInfo = await Reaction.create([payload], { session });
      if (!reactionInfo.length) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
    }
    if (
      reactionForThisUserOfThisBlogExists &&
      reactionForThisUserOfThisBlogExists?.reaction === payload.reaction
    ) {
      const reactResult = await Blog.findByIdAndUpdate(
        blog_id,
        { $inc: { [updateField]: -1 } },
        { session, new: true, runValidators: true },
      );
      if (!reactResult) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
      const reactionInfo = await Reaction.deleteOne(
        { blogId: isBlogExists?._id, userId: userInfo?._id },
        { session },
      );
      if (reactionInfo.deletedCount === 0) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
    }
    if (
      reactionForThisUserOfThisBlogExists &&
      reactionForThisUserOfThisBlogExists?.reaction !== payload.reaction
    ) {
      const decreaseReaction = `reaction.${reactionForThisUserOfThisBlogExists?.reaction}`;
      const reactResult = await Blog.findByIdAndUpdate(
        blog_id,
        { $inc: { [updateField]: 1, [decreaseReaction]: -1 } },
        { session, new: true, runValidators: true },
      );
      if (!reactResult) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
      const updateFromReaction = await Reaction.findOneAndUpdate(
        { blogId: isBlogExists?._id, userId: userInfo?._id },
        { reaction: payload.reaction },
        { session, new: true, runValidators: true },
      );
      if (!updateFromReaction) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
    }
    await session.commitTransaction();
    await session.endSession();
    const result = await Blog.findById(blog_id);
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
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
  countReaction,
};
