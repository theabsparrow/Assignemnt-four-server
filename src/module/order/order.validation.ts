import { z } from 'zod';
import {
  deliveryMethod,
  orderStatus,
  paymentMethod,
  paymentOption,
  trackingStatus,
} from './order.const';

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

const orderTrackingValidationSchema = z.object({
  isTracking: z.boolean({
    required_error: 'tracking info must be boolean',
  }),
});
const orderStatusChangeValidationSchema = z.object({
  status: z.enum([...orderStatus] as [string, ...string[]]),
});
const trackingStatusChangeValidationSchema = z.object({
  trackingStatus: z.enum([...trackingStatus] as [string, ...string[]]),
});
export const orderValidation = {
  orderValidationSchema,
  orderTrackingValidationSchema,
  orderStatusChangeValidationSchema,
  trackingStatusChangeValidationSchema,
};
