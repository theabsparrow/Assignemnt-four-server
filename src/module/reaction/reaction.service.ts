/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { Blog } from '../blog/blog.model';
import { Reaction } from './reaction.model';
import { TReaction } from './reaction.interface';
import mongoose, { Types } from 'mongoose';
import { Comment } from '../comment/comment.model';

const createReaction = async ({
  userId,
  blogId,
}: {
  userId: string;
  blogId: string;
}) => {
  const isBlogExists = await Blog.findById(blogId).select('isDeleted');
  if (!isBlogExists || isBlogExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'data not found');
  }
  const payload: TReaction = {
    blogId: isBlogExists?._id,
    userId: new Types.ObjectId(userId),
  };

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // find if there is already a reaction
    const reactionForThisUserOfThisBlogExists = await Reaction.findOne({
      blogId: isBlogExists?._id,
      userId,
    }).select('reaction');
    // decrease reaction count if already react
    if (reactionForThisUserOfThisBlogExists) {
      const reactResult = await Blog.findByIdAndUpdate(
        isBlogExists?._id,
        { $inc: { reaction: -1 } },
        { session, new: true, runValidators: true },
      );
      if (!reactResult) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
      const reactionInfo = await Reaction.deleteOne(
        { blogId: isBlogExists?._id, userId },
        { session },
      );
      if (reactionInfo.deletedCount === 0) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
    } else {
      const reactionInfo = await Reaction.create([payload], { session });
      if (!reactionInfo.length) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
      const reactResult = await Blog.findByIdAndUpdate(
        isBlogExists?._id,
        { $inc: { reaction: 1 } },
        { session, new: true, runValidators: true },
      );
      if (!reactResult) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
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

const getMyReaction = async (id: string, userId: string) => {
  const isBlogExists = await Blog.findById(id).select('title, isDeleted');
  if (!isBlogExists || isBlogExists.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'data not found');
  }
  const blogId = isBlogExists?._id;
  const result = await Reaction.findOne({ blogId, userId }).select('_id');
  if (result) {
    return result;
  }
  return null;
};

const createCommentReaction = async ({
  userId,
  commentId,
}: {
  userId: string;
  commentId: string;
}) => {
  const isCommentExists = await Comment.findById(commentId).select('isDeleted');
  if (!isCommentExists || isCommentExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'data not found');
  }
  const payload: TReaction = {
    commentId: isCommentExists?._id,
    userId: new Types.ObjectId(userId),
  };
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // find if there is already a reaction
    const reactionForThisUserOfThisCommentExists = await Reaction.findOne({
      commentId: isCommentExists?._id,
      userId,
    }).select('reaction');
    // decrease reaction count if already react
    if (reactionForThisUserOfThisCommentExists) {
      const reactResult = await Comment.findByIdAndUpdate(
        isCommentExists?._id,
        { $inc: { reaction: -1 } },
        { session, new: true, runValidators: true },
      );
      if (!reactResult) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
      const reactionInfo = await Reaction.deleteOne(
        { commentId: isCommentExists?._id, userId },
        { session },
      );
      if (reactionInfo.deletedCount === 0) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
    } else {
      const reactionInfo = await Reaction.create([payload], { session });
      if (!reactionInfo.length) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
      const reactResult = await Comment.findByIdAndUpdate(
        isCommentExists?._id,
        { $inc: { reaction: 1 } },
        { session, new: true, runValidators: true },
      );
      if (!reactResult) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to react');
      }
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

const getMyCommentReaction = async (id: string, userId: string) => {
  const isCommentExists = await Comment.findById(id).select('isDeleted');
  if (!isCommentExists || isCommentExists.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'data not found');
  }
  const commentId = isCommentExists?._id;
  const result = await Reaction.findOne({ commentId, userId }).select('_id');
  if (result) {
    return result;
  }
  return null;
};

export const reactionService = {
  createReaction,
  getMyReaction,
  createCommentReaction,
  getMyCommentReaction,
};
