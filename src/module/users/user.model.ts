/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';
import { TUser, TUSerName } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userNameSchema = new Schema<TUSerName>({
  firstName: {
    type: String,
    required: [true, 'first name is required'],
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'last name is required'],
    trim: true,
  },
});

const userSchema = new Schema<TUser>(
  {
    name: {
      type: userNameSchema,
      required: [true, 'name is required'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      trim: true,
      // unique: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      select: 0,
    },
    phoneNumber: {
      type: String,
      // unique: true,
      required: [true, 'phone number is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
      required: [true, 'gender is required'],
    },
    dateOfBirth: {
      type: String,
      required: [true, 'birth date is required'],
    },
    profileImage: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'active',
    },
    role: {
      type: String,
      default: 'user',
    },
    homeTown: {
      type: String,
      default: '',
    },
    currentAddress: {
      type: String,
      default: '',
    },
    verifyWithEmail: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

userSchema.post('save', function (data, next) {
  data.password = '';
  next();
});
export const User = model<TUser>('USer', userSchema);
