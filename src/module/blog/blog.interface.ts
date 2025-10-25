import { Types } from 'mongoose';
export type TBlogStatus = 'draft' | 'published';
export type TBlog = {
  authorId: Types.ObjectId;
  title: string;
  content: string;
  image?: string;
  tags?: string[];
  status: TBlogStatus;
  reaction: number;
  comments: number;
  isDeleted: boolean;
};

export interface TExtendedBlog extends TBlog {
  addTags: string[];
  removeTags: string[];
  removePhoto: string;
}
