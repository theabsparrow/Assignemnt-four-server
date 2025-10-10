import { model, Schema } from 'mongoose';
import { TDeliveryAndPayment, TDeliveryMethod } from './carDelivery.interface';
import {
  deliveryOptions,
  estimatedTimes,
  paymentMethod,
  paymentOptions,
} from './carDelivery.const';

const deliveryMethodSchema = new Schema<TDeliveryMethod>({
  deliveryOption: {
    type: String,
    required: [true, 'delivery option is required'],
    enum: deliveryOptions,
  },
  estimatedTime: {
    type: String,
    enum: estimatedTimes,
    required: [true, 'estimated time is required'],
  },
  deliveryCost: {
    type: Number,
    default: 0,
  },
});

const deliveryAndPaytmentSchema = new Schema<TDeliveryAndPayment>(
  {
    paymentMethod: {
      type: [String],
      required: [true, 'minimum one payment method is required'],
      enum: paymentMethod,
    },
    paymentOption: {
      type: [String],
      enum: paymentOptions,
    },
    deliveryMethod: {
      type: [deliveryMethodSchema],
      required: [true, 'delivery method is required'],
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

export const DeliveryAndPayment = model<TDeliveryAndPayment>(
  'DeliveryAndPayment',
  deliveryAndPaytmentSchema,
);
