import { z } from 'zod';
import { carBrand, carCategory } from '../car/car.const';
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
    .min(1, { message: 'content can`t be blank' })
    .max(5000, 'content can`t be more than  5000 character'),
  image: z.string().url({ message: 'Invalid image URL' }).optional(),
  tags: z
    .array(z.string())
    .max(5, { message: 'tags can`t be more than 5' })
    .optional(),
  status: z.enum([...blogStatus] as [string, ...string[]], {
    required_error: 'status is required',
  }),
});

const updateBlogValidationSchema = z.object({
  title: z
    .string({
      required_error: 'title is required',
    })
    .min(1, { message: 'title can`t be blank' })
    .max(50, { message: 'title can`t be more than 5000 character' })
    .optional(),
  content: z
    .string({
      required_error: 'content is required',
    })
    .min(1, { message: 'content can`t be blank' })
    .optional(),
  image: z.string().url({ message: 'Invalid image URL' }).optional(),
  addTags: z.array(z.string()).optional(),
  removeTags: z.array(z.string()).optional(),
  brand: z
    .enum([...carBrand] as [string, ...string[]], {
      required_error: 'Car brand is required',
    })
    .optional(),
  model: z
    .string()
    .max(25, { message: 'Car model must be less than 25 characters' })
    .optional(),
  category: z
    .enum([...carCategory] as [string, ...string[]], {
      required_error: 'Category is required',
    })
    .optional(),
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
