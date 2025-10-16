import { Types } from 'mongoose';
export type TReaction = {
  blogId?: Types.ObjectId;
  userId: Types.ObjectId;
  commentId?: Types.ObjectId;
};
