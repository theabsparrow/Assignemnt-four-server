import { Types } from 'mongoose';
export type TReactionOptions = 'like' | 'love' | 'dislike';
export type TReaction = {
  blogId?: Types.ObjectId;
  userId: Types.ObjectId;
  reaction: TReactionOptions;
  commentId?: Types.ObjectId;
};
