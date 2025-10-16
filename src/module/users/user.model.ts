/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';
import { TUser, TUSerName } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { gender } from './user.constant';

const userNameSchema = new Schema<TUSerName>({
  firstName: {
    type: String,
    required: [true, 'first name is required'],
    maxlength: [50, 'first name can`t be more than 50 character'],
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [50, 'middle name name can`t be more than 50 character'],
  },
  lastName: {
    type: String,
    required: [true, 'last name is required'],
    trim: true,
    maxlength: [50, 'last name can`t be more than 50 character'],
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
      maxlength: [100, 'email can`t be more than 50 character'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      select: 0,
      maxlength: [20, 'password can`t be more than 50 character'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'phone number is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: gender,
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
      maxlength: [50, 'home town can`t be more than 50 character'],
      default: '',
    },
    currentAddress: {
      type: String,
      maxlength: [50, 'current address can`t be more than 50 character'],
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
export const User = model<TUser>('User', userSchema);
