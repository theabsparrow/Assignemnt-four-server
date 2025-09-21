import {
  TDeliveryMethod,
  TEstimatedTime,
  TPaymentMethod,
  TPaymentOptions,
} from './carDelivery.interface';

export const paymentMethod: TPaymentMethod[] = [
  'Cash on Delivery',
  'Online Payment',
] as const;
export const paymentOptions: TPaymentOptions[] = [
  'SSLCommerz',
  'Stripe',
  'SurjoPay',
] as const;

export const deliveryMethods: TDeliveryMethod[] = [
  'Home Delivery',
  'Pickup',
  'Express Delivery',
];
export const estimatedTimes: TEstimatedTime[] = [
  '24 hours',
  '2 days',
  '5 days',
  '6 days',
  '8 days',
  '9 days',
  '10 days',
];
