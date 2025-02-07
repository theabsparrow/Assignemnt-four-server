import { model, Schema } from 'mongoose';
import { TOtp } from './otp.interface';

const otpSchema = new Schema<TOtp>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user id is required'],
      unique: true,
      ref: 'User',
    },
    otp: {
      type: String,
      required: [true, 'OTP is required'],
      minlength: 6,
      maxlength: 6,
    },
  },
  {
    timestamps: true,
  },
);
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export const Otp = model<TOtp>('Otp', otpSchema);
