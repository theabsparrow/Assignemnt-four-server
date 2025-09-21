import { z } from 'zod';
import { features, warranty } from './safetyFeature.const';

const safetyFeatureValidationSchema = z.object({
  safetyRating: z
    .number()
    .min(1, { message: 'Safety rating must be at least 1' })
    .max(5, { message: 'Safety rating cannot exceed 5' })
    .refine((val) => [1, 2, 3, 4, 5].includes(val), {
      message: 'Invalid safety rating',
    }),

  airbags: z
    .number()
    .min(1, { message: 'Airbags must be at least 1' })
    .max(10, { message: 'Airbags cannot exceed 10' })
    .refine((val) => [1, 2, 4, 6, 8, 10].includes(val), {
      message: 'Invalid number of airbags',
    }),

  features: z
    .array(z.string())
    .min(1, { message: 'At least one feature is required' })
    .refine((val) => val.every((feature) => features.includes(feature)), {
      message: 'Invalid feature found',
    }),

  warranty: z.string().refine((val) => warranty.includes(val), {
    message: 'Invalid warranty type',
  }),
});

const updateSafetyFeatureValidationSchema = z.object({
  safetyRating: z
    .number()
    .min(1, { message: 'Safety rating must be at least 1' })
    .max(5, { message: 'Safety rating cannot exceed 5' })
    .refine((val) => [1, 2, 3, 4, 5].includes(val), {
      message: 'Invalid safety rating',
    })
    .optional(),
  airbags: z
    .number()
    .min(1, { message: 'Airbags must be at least 1' })
    .max(10, { message: 'Airbags cannot exceed 10' })
    .refine((val) => [1, 2, 4, 6, 8, 10].includes(val), {
      message: 'Invalid number of airbags',
    })
    .optional(),
  features: z
    .array(z.string())
    .min(1, { message: 'At least one feature is required' })
    .refine((val) => val.every((feature) => features.includes(feature)), {
      message: 'Invalid feature found',
    })
    .optional(),
  warranty: z
    .string()
    .refine((val) => warranty.includes(val), {
      message: 'Invalid warranty type',
    })
    .optional(),
});

export const safetyFeatureValidation = {
  safetyFeatureValidationSchema,
  updateSafetyFeatureValidationSchema,
};
