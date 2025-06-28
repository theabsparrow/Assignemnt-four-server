import { Types } from 'mongoose';

export type TComment = {
  blogId?: Types.ObjectId;
  parentId?: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  isDeleted: boolean;
};
