import { z } from 'zod';
import { years } from '../car/car.const';

const registrationDataValidationSchema = z.object({
  licensePlate: z
    .string({ required_error: 'license plate is required' })
    .trim()
    .min(1, { message: 'License plate is required' })
    .max(20, { message: 'License plate cannot exceed 20 characters' }),
  vin: z
    .string({ required_error: 'VIN is required' })
    .trim()
    .min(1, { message: 'VIN (Vehicle Identification Number) is required' })
    .max(17, { message: 'VIN cannot exceed 17 characters' }),
  registrationYear: z.enum([...years] as [string, ...string[]], {
    required_error: 'registration year is required',
  }),
  registrationAuthority: z
    .string({ required_error: 'registration authority is required' })
    .trim()
    .min(1, { message: 'Registration authority is required' })
    .max(50, {
      message: 'registration authority can`t be more than 50 character',
    }),
  previousOwner: z
    .string()
    .trim()
    .max(50, {
      message: 'previous owner info can`t be more than  50 character',
    })
    .optional(),
  previousOwnerAddress: z
    .string()
    .trim()
    .max(50, {
      message: 'previous owner adress can`t be more than 50 haracter',
    })
    .optional(),
  registrationCountry: z
    .string({ required_error: 'registration authority is required' })
    .trim()
    .min(1, { message: 'Registration country is required' })
    .max(30, { message: 'country can`t be more than 30 character' }),
});

const updateRegistrationDataValidationSchema = z.object({
  licensePlate: z
    .string({ required_error: 'license plate is required' })
    .trim()
    .min(1, { message: 'License plate is required' })
    .max(20, { message: 'License plate cannot exceed 20 characters' })
    .optional(),
  vin: z
    .string({ required_error: 'VIN is required' })
    .trim()
    .min(1, { message: 'VIN (Vehicle Identification Number) is required' })
    .max(17, { message: 'VIN cannot exceed 17 characters' })
    .optional(),
  registrationYear: z
    .enum([...years] as [string, ...string[]], {
      required_error: 'registration year is required',
    })
    .optional(),
  registrationAuthority: z
    .string({ required_error: 'registration authority is required' })
    .trim()
    .min(1, { message: 'Registration authority is required' })
    .max(50, {
      message: 'registration authority can`t be more than 50 character',
    })
    .optional(),
  previousOwner: z
    .string()
    .trim()
    .min(1, { message: 'Previous owner is required' })
    .max(50, {
      message: 'previous owner info can`t be more than  50 character',
    })
    .optional(),
  previousOwnerAddress: z
    .string()
    .trim()
    .min(1, { message: 'Previous owner address is required' })
    .max(50, {
      message: 'previous owner adress can`t be more than 50 haracter',
    })
    .optional(),
  registrationCountry: z
    .string({ required_error: 'registration authority is required' })
    .trim()
    .min(1, { message: 'Registration country is required' })
    .max(30, { message: 'country can`t be more than 30 character' })
    .optional(),
});

export const registrationDataValidation = {
  registrationDataValidationSchema,
  updateRegistrationDataValidationSchema,
};
