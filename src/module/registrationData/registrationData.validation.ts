import { z } from 'zod';

const registrationDataValidationSchema = z.object({
  licensePlate: z
    .string()
    .trim()
    .min(1, { message: 'License plate is required' })
    .max(20, { message: 'License plate cannot exceed 20 characters' }),
  vin: z
    .string()
    .trim()
    .min(1, { message: 'VIN (Vehicle Identification Number) is required' })
    .max(17, { message: 'VIN cannot exceed 17 characters' }),
  registrationYear: z
    .string()
    .min(4, {
      message: 'Registration year must be 4 characters (e.g., 2022)',
    })
    .max(4, {
      message: 'Registration year must be 4 characters (e.g., 2022)',
    }),
  registrationAuthority: z
    .string()
    .trim()
    .min(1, { message: 'Registration authority is required' }),
  previousOwner: z
    .string()
    .trim()
    .min(1, { message: 'Previous owner is required' })
    .optional(),
  previousOwnerAddress: z
    .string()
    .trim()
    .min(1, { message: 'Previous owner address is required' })
    .optional(),
  registrationCountry: z
    .string()
    .trim()
    .min(1, { message: 'Registration country is required' }),
});

const updateRegistrationDataValidationSchema = z.object({
  licensePlate: z
    .string()
    .trim()
    .min(1, { message: 'License plate is required' })
    .max(20, { message: 'License plate cannot exceed 20 characters' })
    .optional(),
  vin: z
    .string()
    .trim()
    .min(1, { message: 'VIN (Vehicle Identification Number) is required' })
    .max(17, { message: 'VIN cannot exceed 17 characters' })
    .optional(),
  registrationYear: z
    .string()
    .min(4, {
      message: 'Registration year must be 4 characters (e.g., 2022)',
    })
    .max(4, {
      message: 'Registration year must be 4 characters (e.g., 2022)',
    })
    .optional(),
  registrationAuthority: z
    .string()
    .trim()
    .min(1, { message: 'Registration authority is required' })
    .optional(),
  previousOwner: z
    .string()
    .trim()
    .min(1, { message: 'Previous owner is required' })
    .optional(),
  previousOwnerAddress: z
    .string()
    .trim()
    .min(1, { message: 'Previous owner address is required' })
    .optional(),
  registrationCountry: z
    .string()
    .trim()
    .min(1, { message: 'Registration country is required' })
    .optional(),
});

export const registrationDataValidation = {
  registrationDataValidationSchema,
  updateRegistrationDataValidationSchema,
};
