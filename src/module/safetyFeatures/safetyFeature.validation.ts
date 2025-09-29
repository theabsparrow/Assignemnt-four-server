import { z } from 'zod';
import {
  airBags,
  features,
  safetyRating,
  warranty,
} from './safetyFeature.const';

const safetyFeatureValidationSchema = z.object({
  features: z.array(
    z.enum([...features] as [string, ...string[]], {
      required_error: 'features are required',
    }),
  ),
  airbags: z.enum([...airBags] as [string, ...string[]]).optional(),
  warranty: z.enum([...warranty] as [string, ...string[]], {
    required_error: 'warenty is required',
  }),
  safetyRating: z.enum([...safetyRating] as [string, ...string[]], {
    required_error: 'safety rating is required',
  }),
});

const updateSafetyFeatureValidationSchema = z.object({
  addFeatures: z
    .array(
      z.enum([...features] as [string, ...string[]], {
        required_error: 'features are required',
      }),
    )
    .optional(),
  removeFeatures: z
    .array(
      z.enum([...features] as [string, ...string[]], {
        required_error: 'features are required',
      }),
    )
    .optional(),
  airbags: z.enum([...airBags] as [string, ...string[]]).optional(),
  warranty: z
    .enum([...warranty] as [string, ...string[]], {
      required_error: 'warenty is required',
    })
    .optional(),
  safetyRating: z
    .enum([...safetyRating] as [string, ...string[]], {
      required_error: 'safety rating is required',
    })
    .optional(),
});

export const safetyFeatureValidation = {
  safetyFeatureValidationSchema,
  updateSafetyFeatureValidationSchema,
};
