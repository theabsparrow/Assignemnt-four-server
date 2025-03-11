import { Schema, model } from 'mongoose';
import { Torder, TTrackingInfo } from './order.interface';
import {
  deliveryMethod,
  orderStatus,
  paymentMethod,
  trackingStatus,
} from './order.const';

const trackingSchema = new Schema<TTrackingInfo>({
  trackingID: {
    type: String,
    required: [true, 'tracking id is required'],
    unique: true,
  },
  trackingStatus: {
    type: String,
    enum: trackingStatus,
    default: 'Pending',
  },
});

const orderSchema = new Schema<Torder>(
  {
    userEmail: {
      type: String,
      required: [true, 'use email is required'],
    },
    userID: {
      type: Schema.Types.ObjectId,
      required: [true, 'userID is required'],
    },
    car: {
      type: Schema.Types.ObjectId,
      required: [true, 'Car Id is required'],
      unique: true,
    },
    quantity: {
      type: Number,
      required: [true, 'quantity is required'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'total price is required'],
      min: [1, 'total price can`t be less than 1'],
    },
    status: {
      type: String,
      enum: orderStatus,
      default: 'Pending',
    },
    orderID: String,
    transactionStatus: String,
    bank_status: String,
    sp_code: String,
    sp_message: String,
    method: String,
    date_time: String,
    deliveryMethod: {
      type: String,
      enum: deliveryMethod,
      required: [true, 'delivery method is required'],
    },
    tracking: trackingSchema,
    location: String,
    nearestDealer: String,
    phoneNumber: String,
    deliveryCost: {
      type: String,
      required: [true, 'delivery cost is required'],
    },
    estimatedDeliveryTime: {
      type: String,
      required: [true, 'delivery time is required'],
    },
    paymentMethod: {
      type: String,
      enum: paymentMethod,
      required: [true, 'payment method is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Order = model<Torder>('Order', orderSchema);
export default Order;
