import { model, Schema } from 'mongoose';
import { TCarEngine } from './carEngine.interface';
import {
  accelaration,
  driveTrain,
  engine,
  fuelType,
  horsePower,
  topSpeed,
  torque,
  transmission,
} from './carEngine.const';

const carEngineSchema = new Schema<TCarEngine>(
  {
    engine: {
      type: String,
      enum: engine,
      required: [true, 'engine is required'],
    },
    transmission: {
      type: String,
      enum: transmission,
      required: [true, 'transmission is required'],
    },
    mileage: {
      type: String,
      required: [true, 'mileage is required'],
    },
    fuelType: {
      type: String,
      enum: fuelType,
      required: [true, 'fuel type is required'],
    },
    driveTrain: {
      type: String,
      enum: driveTrain,
      required: [true, 'drive train is required'],
    },
    horsePower: {
      type: String,
      enum: horsePower,
      required: [true, 'horse power is required'],
    },
    torque: {
      type: String,
      enum: torque,
      required: [true, 'torque is required'],
    },
    topSpeed: {
      type: String,
      enum: topSpeed,
      required: [true, 'torque is required'],
    },
    acceleration: {
      type: String,
      enum: accelaration,
      required: [true, 'accelaration is required'],
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

export const CarEngine = model<TCarEngine>('CarEngine', carEngineSchema);
