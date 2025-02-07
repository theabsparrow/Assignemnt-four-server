import { Types } from 'mongoose';

export type TOtp = {
  user: Types.ObjectId;
  otp: string;
};
