import { model, Schema } from 'mongoose';
import { TSafetyFeature } from './safetyFeature.interface';
import {
  airBags,
  features,
  safetyRating,
  warranty,
} from './safetyFeature.const';

const safetyFeatureSchema = new Schema<TSafetyFeature>(
  {
    safetyRating: {
      type: Number,
      enum: safetyRating,
      required: [true, 'safety rating is required'],
    },
    airbags: {
      type: Number,
      enum: airBags,
      required: [true, 'safety rating is required'],
    },
    features: {
      type: [String],
      enum: features,
      required: [true, 'features are required'],
    },
    warranty: {
      type: String,
      enum: warranty,
      required: [true, 'warrenty is required'],
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

export const SafetyFeature = model<TSafetyFeature>(
  'SafetyFeature',
  safetyFeatureSchema,
);
