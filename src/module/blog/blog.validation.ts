import { z } from 'zod';
import { blogStatus } from './blog.const';

const blogValidationSchema = z.object({
  title: z
    .string({
      required_error: 'title is required',
    })
    .min(1, { message: 'title can`t be blank' })
    .max(100, { message: 'title can`t be more than 100 character' }),
  content: z
    .string({
      required_error: 'content is required',
    })
    .min(50, { message: 'content must be at least 50 character' })
    .max(5000, 'content can`t be more than  5000 character'),
  image: z.string().url({ message: 'Invalid image URL' }).optional(),
  tags: z
    .array(z.string())
    .max(5, { message: 'tags can`t be more than 5' })
    .optional(),
});

const updateBlogValidationSchema = z.object({
  title: z
    .string({
      required_error: 'title is required',
    })
    .min(1, { message: 'title can`t be blank' })
    .max(100, { message: 'title can`t be more than 5000 character' })
    .optional(),
  content: z
    .string({
      required_error: 'content is required',
    })
    .min(50, { message: 'content must be at least 50 character' })
    .max(5000, 'content can`t be more than  5000 character')
    .optional(),
  image: z.string().url({ message: 'Invalid image URL' }).optional(),
  addTags: z.array(z.string()).optional(),
  removeTags: z.array(z.string()).optional(),
  status: z
    .enum([...blogStatus] as [string, ...string[]], {
      required_error: 'status is required',
    })
    .optional(),
});

export const blogValidation = {
  blogValidationSchema,
  updateBlogValidationSchema,
};
