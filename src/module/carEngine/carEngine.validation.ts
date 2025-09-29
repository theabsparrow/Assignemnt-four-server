import { z } from 'zod';
import {
  accelaration,
  driveTrain,
  engine,
  fuelType,
  horsePower,
  topSpeed,
  torque,
  transmission,
} from './carEngine.const';

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
  horsePower: z.enum([...horsePower] as [string, ...string[]], {
    required_error: 'Horsepower is required',
  }),
  torque: z.enum([...torque] as [string, ...string[]], {
    required_error: 'Torque is required',
  }),
  topSpeed: z.enum([...topSpeed] as [string, ...string[]], {
    required_error: 'Top speed is required',
  }),
  acceleration: z.enum([...accelaration] as [string, ...string[]], {
    required_error: 'Acceleration is required',
  }),
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
    .enum([...horsePower] as [string, ...string[]], {
      required_error: 'Horsepower is required',
    })
    .optional(),
  torque: z
    .enum([...torque] as [string, ...string[]], {
      required_error: 'Torque is required',
    })
    .optional(),
  topSpeed: z
    .enum([...topSpeed] as [string, ...string[]], {
      required_error: 'Top speed is required',
    })
    .optional(),
  acceleration: z
    .enum([...accelaration] as [string, ...string[]], {
      required_error: 'Acceleration is required',
    })
    .optional(),
});

export const engineInfoValidation = {
  engineInfoValidationSchema,
  updateEngineInfoValidationSchema,
};
