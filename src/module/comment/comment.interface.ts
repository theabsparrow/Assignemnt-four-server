import { Types } from 'mongoose';

export type TComment = {
  blogId: Types.ObjectId;
  commentId?: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  recation: number;
  replies: number;
  isDeleted: boolean;
};
