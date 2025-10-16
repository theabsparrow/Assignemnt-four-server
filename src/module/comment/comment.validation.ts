import { z } from 'zod';

const commentValidationSchema = z.object({
  commentId: z
    .string({ invalid_type_error: 'commentId should be string' })
    .optional(),
  content: z
    .string({ required_error: 'content is required' })
    .max(500, 'content can`t be more than 500 character'),
});

const updateCommentValidationSchema = z.object({
  content: z
    .string({ required_error: 'content is required' })
    .max(500, 'content can`t be more than 500 character')
    .optional(),
});

export const commentValidation = {
  commentValidationSchema,
  updateCommentValidationSchema,
};
