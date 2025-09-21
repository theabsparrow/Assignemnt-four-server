import {
  TOrderStatusInfo,
  TPaymentStatus,
  TTrackingStatusInfo,
} from './order.interface';

export const orderStatus = [
  'Pending',
  'Paid',
  'Completed',
  'Cancelled',
  'Cash on Delivery',
];

export const paymentStatus: TPaymentStatus = {
  success: 'Success',
  failed: 'Failed',
  cancel: 'Cancel',
} as const;

export const orderStatusInfo: TOrderStatusInfo = {
  pending: 'Pending',
  paid: 'Paid',
  completed: 'Completed',
  cancelled: 'Cancelled',
  'Cash on Delivery': 'Cash on Delivery',
} as const;

export const trackingStatusinfo: TTrackingStatusInfo = {
  processing: 'Processing',
  shipped: 'Shipped',
  'Out for Delivery': 'Out for Delivery',
  delivered: 'Delivered',
  'Order Placed': 'Order Placed',
  cancelled: 'Cancelled',
} as const;

export const trackingStatus: string[] = [
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Order Placed',
  'Cancelled',
  'Pending',
];
