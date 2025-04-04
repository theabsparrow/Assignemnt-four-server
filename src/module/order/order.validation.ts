import { z } from 'zod';
import { deliveryMethod, paymentMethod, paymentOption } from './order.const';

const orderValidationSchema = z.object({
  deliveryMethod: z.enum([...deliveryMethod] as [string, ...string[]]),
  estimatedDeliveryTime: z.string(),
  location: z.string().optional(),
  nearestDealer: z.string().optional(),
  phoneNumber: z.string(),
  deliveryCost: z.number(),
  paymentMethod: z.enum([...paymentMethod] as [string, ...string[]]),
  paymentOption: z.enum([...paymentOption] as [string, ...string[]]),
});

export const orderValidation = {
  orderValidationSchema,
};
