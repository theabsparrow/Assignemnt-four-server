import { Types } from 'mongoose';

type TOrderStatus = 'Pending' | 'Paid' | 'Shipped' | 'Completed' | 'Cancelled';
export type Torder = {
  userID: Types.ObjectId;
  userEmail: string;
  car: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: TOrderStatus;
};
