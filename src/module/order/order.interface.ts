import { Types } from 'mongoose';
import {
  TDeliveryMethod,
  TPaymentMethod,
  TPaymentOptions,
} from '../carDelivery/carDelivery.interface';

export type TOrderStatus =
  | 'Pending'
  | 'Paid'
  | 'Completed'
  | 'Cancelled'
  | 'Cash on Delivery';
export type TTrackingStatus =
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Order Placed'
  | 'Cancelled';
export type TTrackingInfo = {
  trackingID?: string;
  trackingStatus?: TTrackingStatus;
  isTracking?: boolean;
};
export type Torder = {
  userID: Types.ObjectId;
  car: Types.ObjectId;
  userEmail: string;
  quantity: number;
  totalPrice: number;
  status: TOrderStatus;
  orderID: string;
  transactionStatus: string;
  bank_status: string;
  sp_code: string;
  sp_message: string;
  method: string;
  date_time: string;
  deliveryMethod: TDeliveryMethod;
  tracking: TTrackingInfo;
  location?: string;
  nearestDealer?: string;
  estimatedDeliveryTime: string;
  phoneNumber: string;
  deliveryCost: number;
  paymentMethod: TPaymentMethod;
  paymentOption?: TPaymentOptions;
  isDeleted: boolean;
};

export type TPaymentStatus = {
  success: 'Success';
  failed: 'Failed';
  cancel: 'Cancel';
};

export type TOrderStatusInfo = {
  pending: 'Pending';
  paid: 'Paid';
  completed: 'Completed';
  cancelled: 'Cancelled';
  'Cash on Delivery': 'Cash on Delivery';
};

export type TTrackingStatusInfo = {
  processing: 'Processing';
  shipped: 'Shipped';
  'Out for Delivery': 'Out for Delivery';
  delivered: 'Delivered';
  'Order Placed': 'Order Placed';
  cancelled: 'Cancelled';
};
