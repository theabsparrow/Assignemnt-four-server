import { model, Schema } from 'mongoose';
import { TRegistrationdata } from './registrationData.interface';

const registrationDataSchema = new Schema<TRegistrationdata>(
  {
    licensePlate: {
      type: String,
      required: [true, 'License plate is required'],
      unique: true,
      trim: true,
    },
    vin: {
      type: String,
      required: [true, 'VIN (Vehicle Identification Number) is required'],
      unique: true,
      trim: true,
    },
    registrationYear: {
      type: String,
      required: [true, 'Registration year is required'],
    },
    registrationAuthority: {
      type: String,
      required: [true, 'Registration authority is required'],
      trim: true,
    },
    previousOwner: {
      type: String,
      trim: true,
      required: [true, 'previous owner is required'],
    },
    previousOwnerAddress: {
      type: String,
      trim: true,
      required: [true, 'previous owner address is required'],
    },
    registrationCountry: {
      type: String,
      required: [true, 'Registration country is required'],
      trim: true,
    },
    roadTaxPaid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const RegistrationData = model<TRegistrationdata>(
  'RegistrationData',
  registrationDataSchema,
);
