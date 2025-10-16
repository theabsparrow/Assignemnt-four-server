/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { Blog } from '../blog/blog.model';
import { TComment } from './comment.interface';
import mongoose, { Types } from 'mongoose';
import { Comment } from './comment.model';

const createComment = async ({
  id,
  userId,
  payload,
}: {
  id: string;
  userId: string;
  payload: TComment;
}) => {
  const isBlogExists = await Blog.findById(id).select('isDeleted');
  if (!isBlogExists || isBlogExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'data not found');
  }
  payload.blogId = isBlogExists?._id;
  payload.userId = new Types.ObjectId(userId);
  if (payload?.commentId) {
    payload.commentId = new Types.ObjectId(payload?.commentId);
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await Comment.create([payload], { session });
    if (!result.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to post the comment');
    }
    const countComment = await Blog.findByIdAndUpdate(
      id,
      { $inc: { comments: 1 } },
      { session, new: true, runValidators: true },
    );
    if (!countComment) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

const getAlComment = async (id: string) => {
  const result = await Comment.find({
    blogId: id,
    isDeleted: false,
    commentId: { $exists: false },
  }).populate({
    path: 'userId',
    select: 'name profileImage',
  });
  if (!result || result.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no comment found');
  }
  return result;
};

const getAllReplies = async (id: string) => {
  const result = await Comment.find({
    commentId: id,
    isDeleted: false,
  }).populate({
    path: 'userId',
    select: 'name profileImage',
  });
  if (!result || result.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no comment found');
  }
  return result;
};

const updateComment = async ({
  id,
  userId,
  payload,
}: {
  id: string;
  userId: string;
  payload: Partial<TComment>;
}) => {
  const isCommentExists = await Comment.findById(id).select('isDeleted userId');
  if (!isCommentExists || isCommentExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no comment found');
  }
  if (userId !== isCommentExists?.userId.toString()) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authoruze');
  }
  const result = await Blog.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'faild to update comment');
  }
  return result;
};

const deleteComment = async (id: string, userId: string) => {
  const isCommentExists = await Comment.findById(id).select(
    'isDeleted userId blogId',
  );
  if (!isCommentExists || isCommentExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no comment found');
  }
  const isBlogExists = await Blog.findById(isCommentExists?.blogId).select(
    'isDeleted authorId',
  );
  if (!isBlogExists || isBlogExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no comment found');
  }
  const session = await mongoose.startSession();
  try {
    if (userId === isCommentExists?.userId.toString()) {
      const result = await Comment.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { session, new: true, runValidators: true },
      );
      if (!result) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete comment');
      }
      const commentCOunt = await Blog.findByIdAndUpdate(
        isBlogExists?._id,
        { $inc: { comments: -1 } },
        { session, new: true, runValidators: true },
      );
      if (!commentCOunt) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete comment');
      }
    } else if (userId === isBlogExists?.authorId.toString()) {
      const result = await Comment.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { session, new: true, runValidators: true },
      );
      if (!result) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete comment');
      }
      const commentCOunt = await Blog.findByIdAndUpdate(
        isBlogExists?._id,
        { $inc: { comments: -1 } },
        { session, new: true, runValidators: true },
      );
      if (!commentCOunt) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete comment');
      }
    } else {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'you are not authoruze to delete this comment',
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return null;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

export const commentService = {
  createComment,
  getAlComment,
  getAllReplies,
  deleteComment,
  updateComment,
};
