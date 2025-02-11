import { z } from 'zod';

const orderValidationSchema = z.object({
  car: z.string().nonempty({ message: 'carID is required' }),
  quantity: z
    .number()
    .min(1, { message: 'you have to select at leat one car' }),
});

export const orderValidation = {
  orderValidationSchema,
};
