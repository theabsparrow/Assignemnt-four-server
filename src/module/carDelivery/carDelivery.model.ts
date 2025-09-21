import { model, Schema } from 'mongoose';
import { TDeliveryAndPayment } from './carDelivery.interface';
import {
  deliveryMethods,
  estimatedTimes,
  paymentMethod,
  paymentOptions,
} from './carDelivery.const';

const deliveryAndPaytmentSchema = new Schema<TDeliveryAndPayment>(
  {
    paymentMethod: {
      type: [String],
      required: [true, 'minimum one payment method is required'],
      enum: paymentMethod,
    },
    paymentOption: {
      type: [String],
      required: [true, 'minimum one payment method is required'],
      enum: paymentOptions,
    },
    deliveryMethod: {
      type: String,
      required: [true, 'delivery method is required'],
      enum: deliveryMethods,
    },
    estimatedTime: {
      type: String,
      enum: estimatedTimes,
      required: [true, 'estimated time is required'],
    },
    deliveryCost: {
      type: Number,
      required: [true, 'delivery cost is required'],
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
