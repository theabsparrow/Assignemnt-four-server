import { z } from 'zod';

const serviceHistoryValidationSchema = z.object({
  serviceDate: z
    .string()
    .min(1, { message: 'Service date is required' })
    .max(10, { message: 'date can`t be more than 10 character' })
    .trim(),
  serviceCenter: z
    .string()
    .min(1, { message: 'Service center is required' })
    .max(30, { message: 'service center name can`t be more than 30 character' })
    .trim(),
  serviceDetails: z
    .string()
    .min(1, { message: 'Service details are required' })
    .max(500, { message: 'service details can`t be more than 500 character' })
    .trim(),
  cost: z.number(),
  mileageAtService: z.number(),
});

const updateServiceHistoryValidationSchema = z.object({
  serviceDate: z
    .string()
    .min(1, { message: 'Service date is required' })
    .max(10, { message: 'date can`t be more than 10 character' })
    .trim()
    .optional(),
  serviceCenter: z
    .string()
    .min(1, { message: 'Service center is required' })
    .max(30, { message: 'service center name can`t be more than 30 character' })
    .trim()
    .optional(),
  serviceDetails: z
    .string()
    .min(1, { message: 'Service details are required' })
    .max(500, { message: 'service details can`t be more than 500 character' })
    .trim()
    .optional(),
  cost: z.number().min(0, { message: 'Cost cannot be negative' }).optional(),
  mileageAtService: z
    .number()
    .min(1, { message: 'Mileage is required' })
    .optional(),
});

export const serviceHistoryValidation = {
  serviceHistoryValidationSchema,
  updateServiceHistoryValidationSchema,
};
