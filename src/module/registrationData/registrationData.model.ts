import { model, Schema } from 'mongoose';
import { TRegistrationdata } from './registrationData.interface';

const registrationDataSchema = new Schema<TRegistrationdata>(
  {
    licensePlate: {
      type: String,
      trim: true,
    },
    vin: {
      type: String,
      required: [true, 'VIN (Vehicle Identification Number) is required'],
      trim: true,
      minlength: [17, 'VIN must be exactly 17 characters long'],
      maxlength: [17, 'VIN must be exactly 17 characters long'],
    },
    registrationYear: {
      type: String,
    },
    registrationAuthority: {
      type: String,
      trim: true,
    },
    previousOwner: {
      type: String,
      trim: true,
    },
    previousOwnerAddress: {
      type: String,
      trim: true,
    },
    registrationCountry: {
      type: String,
      trim: true,
    },
    roadTaxPaid: {
      type: Boolean,
      default: false,
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

export const RegistrationData = model<TRegistrationdata>(
  'RegistrationData',
  registrationDataSchema,
);
