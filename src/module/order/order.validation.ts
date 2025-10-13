import { z } from 'zod';
import { orderStatus, trackingStatus } from './order.const';
import {
  deliveryOptions,
  paymentMethod,
  paymentOptions,
} from '../carDelivery/carDelivery.const';

const orderValidationSchema = z.object({
  deliveryOption: z.enum([...deliveryOptions] as [string, ...string[]]),
  paymentMethod: z.enum([...paymentMethod] as [string, ...string[]]),
  paymentOption: z.enum([...paymentOptions] as [string, ...string[]]),
  estimatedDeliveryTime: z.string(),
  deliveryCost: z.number(),
  location: z.string(),
  phoneNumber: z.string(),
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
