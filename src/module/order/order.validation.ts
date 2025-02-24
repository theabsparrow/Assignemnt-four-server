import { z } from 'zod';

const orderValidationSchema = z.object({
  car: z.string().nonempty({ message: 'carID is required' }),
});

export const orderValidation = {
  orderValidationSchema,
};
