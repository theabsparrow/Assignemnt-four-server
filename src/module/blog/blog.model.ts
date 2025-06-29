import { model, Schema } from 'mongoose';
import { TBlog, TBlogReaction } from './blog.interface';
import { carBrand, carCategory } from '../car/car.const';

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
      max: [50, 'title can`t be more that 50 character'],
    },
    content: {
      type: String,
      required: [true, 'content is required'],
      trim: true,
      min: [1, ' content can`t be blank'],
    },
    image: {
      type: String,
    },
    tags: {
      type: [String],
      validate: {
        validator: function (value: string[]) {
          return value.length <= 5;
        },
        message: 'you can store not more that 5 tags',
      },
    },
    brand: {
      type: String,
      required: [true, 'Car Brand name is required'],
      enum: carBrand,
    },
    model: {
      type: String,
      max: [25, 'model can`t be more than 25 character'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Car category is required'],
      enum: carCategory,
    },
    status: {
      type: String,
      required: [true, 'status is required'],
      enum: ['draft', 'published'],
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
