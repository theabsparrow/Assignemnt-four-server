import { model, Schema } from 'mongoose';
import { TBlog, TBlogReaction } from './blog.interface';
import { blogStatus } from './blog.const';

const blogReactionSchema = new Schema<TBlogReaction>({
  like: {
    type: Number,
    default: 0,
  },
  love: {
    type: Number,
    default: 0,
  },
  dislike: {
    type: Number,
    default: 0,
  },
});

const blogSchema = new Schema<TBlog>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      required: [true, ' author is required'],
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'author name is required'],
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
      min: [1, ' content can`t be blank'],
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
      required: [true, 'status is required'],
      enum: blogStatus,
    },
    view: {
      type: Number,
      default: 0,
    },
    reaction: {
      type: blogReactionSchema,
      default: () => ({}),
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
