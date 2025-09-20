import { Types } from 'mongoose';

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
  status: TBlogStatus;
  view: number;
  reaction: TBlogReaction;
  isDeleted: boolean;
};

export interface TExtendedBlog extends TBlog {
  addTags: string[];
  removeTags: string[];
}
