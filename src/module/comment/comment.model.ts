import { model, Schema } from 'mongoose';
import { TComment } from './comment.interface';

const commentSchema = new Schema<TComment>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: [true, 'vkog id is required'],
    },
    commentId: {
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
      minlength: [1, 'content can`t be blank'],
      maxlength: [500, 'content can`t be more than 200 character'],
      trim: true,
    },
    reaction: {
      type: Number,
      default: 0,
    },
    replies: Number,
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
