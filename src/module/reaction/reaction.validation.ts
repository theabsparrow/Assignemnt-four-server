import { z } from 'zod';
import { reactionoptiopns } from './reaction.const';

const reactionValidationSchema = z.object({
  reaction: z.enum([...reactionoptiopns] as [string, ...string[]], {
    required_error: 'reaction option is required',
  }),
});

export const reactionValidation = {
  reactionValidationSchema,
};
