import { model, Schema } from 'mongoose';
import { TserviceHistory } from './serviceHistory.interface';

const serviceHistorySchema = new Schema<TserviceHistory>(
  {
    serviceDate: {
      type: String,
      required: [true, 'Service date is required'],
    },
    serviceCenter: {
      type: String,
      required: [true, 'Service center is required'],
      trim: true,
    },
    serviceDetails: {
      type: String,
      required: [true, 'Service details are required'],
      trim: true,
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: [0, 'Cost cannot be negative'],
    },
    mileageAtService: {
      type: Number,
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

export const ServiceHistory = model<TserviceHistory>(
  'ServiceHistory',
  serviceHistorySchema,
);
