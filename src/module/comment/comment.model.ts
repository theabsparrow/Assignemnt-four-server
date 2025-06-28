import { model, Schema } from 'mongoose';
import { TComment } from './comment.interface';

const commentSchema = new Schema<TComment>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'blog id is required'],
    },
    content: {
      type: String,
      required: [true, 'content is required'],
      min: [1, 'content can`t be blank'],
      max: [200, 'content can`t be more than 200 character'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Comment = model<TComment>('Comment', commentSchema);
