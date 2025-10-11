import { z } from 'zod';
import { driveTrain, engine, fuelType, transmission } from './carEngine.const';

const engineInfoValidationSchema = z.object({
  engine: z.enum([...engine] as [string, ...string[]], {
    required_error: 'Engine is required',
  }),
  transmission: z.enum([...transmission] as [string, ...string[]], {
    required_error: 'Transmission is required',
  }),
  mileage: z
    .number()
    .min(1, { message: 'milage is required' })
    .max(100, { message: 'milage can`t be more than 100' }),
  fuelType: z.enum([...fuelType] as [string, ...string[]], {
    required_error: 'Fuel type is required',
  }),
  driveTrain: z.enum([...driveTrain] as [string, ...string[]], {
    required_error: 'Drive train is required',
  }),
  horsePower: z
    .string({ required_error: 'horse power is required' })
    .max(1000, { message: 'milage can`t be more than 1000 character' }),
  torque: z
    .string({ required_error: 'torquer is required' })
    .max(1000, { message: 'torque can`t be more than 1000 character' }),
  topSpeed: z
    .string({ required_error: 'top speed is required' })
    .max(1000, { message: 'top speed can`t be more than 1000 character' }),
  acceleration: z
    .string({ required_error: 'acceleration power is required' })
    .max(1000, { message: 'acceleration can`t be more than 1000 character' }),
});

const updateEngineInfoValidationSchema = z.object({
  engine: z
    .enum([...engine] as [string, ...string[]], {
      required_error: 'Engine is required',
    })
    .optional(),
  transmission: z
    .enum([...transmission] as [string, ...string[]], {
      required_error: 'Transmission is required',
    })
    .optional(),
  mileage: z
    .number()
    .min(1, { message: 'milage is required' })
    .max(100, { message: 'milage can`t be more than 100' })
    .optional(),
  fuelType: z
    .enum([...fuelType] as [string, ...string[]], {
      required_error: 'Fuel type is required',
    })
    .optional(),
  driveTrain: z
    .enum([...driveTrain] as [string, ...string[]], {
      required_error: 'Drive train is required',
    })
    .optional(),
  horsePower: z
    .string({ required_error: 'horse power is required' })
    .max(1000, { message: 'milage can`t be more than 1000 character' })
    .optional(),
  torque: z
    .string({ required_error: 'torquer is required' })
    .max(1000, { message: 'torque can`t be more than 1000 character' })
    .optional(),
  topSpeed: z
    .string({ required_error: 'top speed is required' })
    .max(1000, { message: 'top speed can`t be more than 1000 character' })
    .optional(),
  acceleration: z
    .string({ required_error: 'acceleration power is required' })
    .max(1000, { message: 'acceleration can`t be more than 1000 character' })
    .optional(),
});

export const engineInfoValidation = {
  engineInfoValidationSchema,
  updateEngineInfoValidationSchema,
};
