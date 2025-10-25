/* eslint-disable @typescript-eslint/no-explicit-any */
import { TBlog, TExtendedBlog } from './blog.interface';
import { User } from '../users/user.model';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { Blog } from './blog.model';
import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { blogSearchAbleFields } from './blog.const';

const createBlog = async (userId: string, payload: TBlog) => {
  const userInfo = await User.findById(userId).select('name');
  payload.authorId = userInfo?._id as Types.ObjectId;
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
  if (!query.page) {
    query.page = 1;
  }
  if (!query.limit) {
    query.limit = 20;
  }
  query = {
    ...query,
    fields:
      'authorId, title, content, image, tags, reaction, comments, createdAt',
    ...filter,
  };

  const blogQuery = new QueryBuilder(Blog.find(), query)
    .search(blogSearchAbleFields)
    .sort()
    .filter()
    .paginateQuery()
    .fields();
  const result = await blogQuery.modelQuery.populate({
    path: 'authorId',
    select: 'name profileImage',
  });
  const meta = await blogQuery.countTotal();
  if (result.length < 1) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blogs found');
  }
  return { meta, result };
};

const getASingleBlog = async (id: string) => {
  const isBlogExists = await Blog.findById(id).populate({
    path: 'authorId',
    select: 'name profileImage',
  });
  if (!isBlogExists || isBlogExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blog found');
  }
  return isBlogExists;
};

const getMyBlogs = async (userId: string, query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};
  filter.isDeleted = false;
  filter.authorId = userId;
  query = { ...query, ...filter };
  const blogQuery = new QueryBuilder(Blog.find(), query)
    .search(blogSearchAbleFields)
    .sort()
    .filter();
  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.countTotal;
  if (result.length < 1) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blogs found');
  }

  return { meta, result };
};

const getMySingleBlog = async (userId: string, id: string) => {
  const result = await Blog.findOne({
    _id: id,
    authorId: userId,
    isDeleted: false,
  }).populate({
    path: 'authorId',
    select: 'name profileImage',
  });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blog found');
  }

  return result;
};

const updateMyBlog = async ({
  userId,
  id,
  payload,
}: {
  userId: string;
  id: string;
  payload: Partial<TExtendedBlog>;
}) => {
  const BlogInfo = await Blog.findById(id).select('isDeleted authorId');
  if (!BlogInfo || BlogInfo?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blog found');
  }

  if (BlogInfo?.authorId.toString() !== userId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'you are not authorized to update this blog',
    );
  }
  const { addTags, removeTags, removePhoto, ...remainingData } = payload;

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
        { session, new: true },
      );
      if (!update) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to update data');
      }
    }
    if (removePhoto && BlogInfo?.image) {
      const update = await Blog.findByIdAndUpdate(
        id,
        { $unset: { image: 1 } },
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

const deleteMyBlog = async (id: string, userId: string) => {
  const BlogInfo = await Blog.findById(id).select('isDeleted');
  if (!BlogInfo || BlogInfo?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no blog found');
  }
  if (BlogInfo?.authorId.toString() !== userId) {
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
  const existBlog = await Blog.findById(id).select('isDeleted');
  if (!existBlog || existBlog?.isDeleted) {
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
