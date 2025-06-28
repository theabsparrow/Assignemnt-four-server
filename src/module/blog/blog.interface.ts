import { Types } from 'mongoose';
import { TCarBrand, TCategory } from '../car/car.interface';

export type TBlogReaction = {
  like: number;
  love: number;
  dislike: number;
};
export type TBlogStatus = 'draft' | 'published';
export type TBlog = {
  authorId: Types.ObjectId;
  name: string;
  title: string;
  content: string;
  image?: string;
  tags?: string[];
  brand: TCarBrand;
  model?: string;
  category: TCategory;
  status: TBlogStatus;
  reaction: TBlogReaction;
  isDeleted: boolean;
};

export interface TExtendedBlog extends TBlog {
  addTags: string[];
  removeTags: string[];
}
