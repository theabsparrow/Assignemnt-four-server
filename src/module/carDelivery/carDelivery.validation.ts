import { z } from 'zod';
import {
  deliveryMethods,
  estimatedTimes,
  paymentMethod,
  paymentOptions,
} from './carDelivery.const';

export const deliveryAndPaymentValidationSchema = z.object({
  paymentMethod: z.array(
    z.enum([...paymentMethod] as [string, ...string[]], {
      required_error: 'payment method is required',
    }),
  ),
  paymentOption: z.array(
    z.enum([...paymentOptions] as [string, ...string[]], {
      required_error: 'payment options are required',
    }),
  ),
  deliveryMethod: z.enum([...deliveryMethods] as [string, ...string[]], {
    required_error: 'delivery methods is required',
  }),
  estimatedTime: z.enum([...estimatedTimes] as [string, ...string[]], {
    required_error: 'estimated time is required',
  }),
  deliveryCost: z.number({ required_error: 'delivery const is required' }),
});

export const updateDeliveryAndPaymentValidatonSchema = z.object({
  addPaymentMethod: z
    .array(
      z.enum([...paymentMethod] as [string, ...string[]], {
        required_error: 'payment method is required',
      }),
    )
    .optional(),
  removePaymentMethod: z
    .array(
      z.enum([...paymentMethod] as [string, ...string[]], {
        required_error: 'payment method is required',
      }),
    )
    .optional(),
  addPaymentOption: z
    .array(
      z.enum([...paymentOptions] as [string, ...string[]], {
        required_error: 'payment options are required',
      }),
    )
    .optional(),
  removePaymentOption: z
    .array(
      z.enum([...paymentOptions] as [string, ...string[]], {
        required_error: 'payment options are required',
      }),
    )
    .optional(),
  deliveryMethod: z
    .enum([...deliveryMethods] as [string, ...string[]], {
      required_error: 'delivery methods is required',
    })
    .optional(),
  estimatedTime: z
    .enum([...estimatedTimes] as [string, ...string[]], {
      required_error: 'estimated time is required',
    })
    .optional(),
  deliveryCost: z
    .number({ required_error: 'delivery const is required' })
    .optional(),
});

export const deliveryAndPaymentValidation = {
  deliveryAndPaymentValidationSchema,
  updateDeliveryAndPaymentValidatonSchema,
};
