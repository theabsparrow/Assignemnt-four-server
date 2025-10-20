import { model, Schema } from 'mongoose';
import { TCarEngine } from './carEngine.interface';
import { driveTrain, fuelType, transmission } from './carEngine.const';

const carEngineSchema = new Schema<TCarEngine>(
  {
    engine: {
      type: String,
      required: [true, 'engine is required'],
    },
    transmission: {
      type: String,
      enum: transmission,
      required: [true, 'transmission is required'],
    },
    mileage: {
      type: Number,
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
      max: [4, 'horse power can`t be more than 4 character'],
      required: [true, 'horse power is required'],
    },
    torque: {
      type: String,
      max: [4, 'torque can`t be more than 4 character'],
      required: [true, 'torque is required'],
    },
    topSpeed: {
      type: String,
      max: [4, 'torque can`t be more than 4 character'],
      required: [true, 'torque is required'],
    },
    acceleration: {
      type: String,
      max: [4, 'accelaration can`t be more than 4 character'],
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
