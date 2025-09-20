import { z } from 'zod';

export const serviceHistoryValidationSchema = z.object({
  serviceDate: z.string().min(1, { message: 'Service date is required' }),
  serviceCenter: z
    .string()
    .min(1, { message: 'Service center is required' })
    .trim(),
  serviceDetails: z
    .string()
    .min(1, { message: 'Service details are required' })
    .trim(),
  cost: z.number().min(0, { message: 'Cost cannot be negative' }),
  mileageAtService: z
    .number()
    .min(0, { message: 'Mileage cannot be negative' }),
});

export const updateServiceHistoryValidationSchema = z.object({
  serviceDate: z
    .string()
    .min(1, { message: 'Service date is required' })
    .optional(),
  serviceCenter: z
    .string()
    .min(1, { message: 'Service center is required' })
    .trim()
    .optional(),
  serviceDetails: z
    .string()
    .min(1, { message: 'Service details are required' })
    .trim()
    .optional(),
  cost: z.number().min(0, { message: 'Cost cannot be negative' }).optional(),
  mileageAtService: z
    .number()
    .min(0, { message: 'Mileage cannot be negative' })
    .optional(),
});
