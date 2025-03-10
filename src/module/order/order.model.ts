import { Schema, model } from 'mongoose';
import { Torder } from './order.interface';
import { orderStatus } from './order.const';

const orderSchema = new Schema<Torder>(
  {
    userEmail: {
      type: String,
      required: [true, 'use email is required'],
    },
    userID: {
      type: Schema.Types.ObjectId,
      required: [true, 'userID is required'],
    },
    car: {
      type: Schema.Types.ObjectId,
      required: [true, 'Car Id is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'quantity is required'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'total price is required'],
      min: [1, 'total price can`t be less than 1'],
    },
    status: {
      type: String,
      enum: orderStatus,
      default: 'Pending',
    },
    orderID: String,
    transactionStatus: String,
    bank_status: String,
    sp_code: String,
    sp_message: String,
    method: String,
    date_time: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Order = model<Torder>('Order', orderSchema);
export default Order;
