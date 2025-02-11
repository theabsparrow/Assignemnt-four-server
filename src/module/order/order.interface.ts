import { Types } from 'mongoose';

type TOrderStatus = 'Pending' | 'Paid' | 'Completed' | 'Cancelled';
export type Torder = {
  userID: Types.ObjectId;
  userEmail: string;
  car: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: TOrderStatus;
  orderID: string;
  transactionStatus: string;
  bank_status: string;
  sp_code: string;
  sp_message: string;
  method: string;
  date_time: string;
  isDeleted: boolean;
};
