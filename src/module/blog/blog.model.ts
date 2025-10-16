import { model, Schema } from 'mongoose';
import { blogStatus } from './blog.const';
import { TBlog } from './blog.interface';

const blogSchema = new Schema<TBlog>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      required: [true, ' author is required'],
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'title is required'],
      min: [1, 'title can`t be blank'],
      max: [100, 'title can`t be more that 100 character'],
    },
    content: {
      type: String,
      required: [true, 'content is required'],
      trim: true,
      min: [50, ' content can`t be blank'],
      max: [5000, 'content can`t be more than 5000 character'],
    },
    image: {
      type: String,
    },
    tags: {
      type: [String],
      validate: {
        validator: function (value: string[]) {
          return value.length <= 10;
        },
        message: 'you can store not more that 10 tags',
      },
    },
    status: {
      type: String,
      enum: blogStatus,
      default: 'published',
    },
    reaction: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
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

export const Blog = model<TBlog>('Blog', blogSchema);
