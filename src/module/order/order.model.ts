import { Schema, model } from 'mongoose';
import { Torder } from './order.interface';

const orderSchema = new Schema<Torder>({
  email: {
    type: String,
    required: [true, 'email is required'],
    validate: {
      validator: function (value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: '{VALUE} is not a valid email',
    },
    unique: true,
    trim: true,
  },
  car: {
    type: String,
    required: [true, 'Car Id is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'quantity is required'],
    min: [1, 'you have to order at least one car'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'total price is required'],
    min: [1, 'total price can`t be less than 1'],
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

orderSchema.pre('save', function (this, next) {
  const now = new Date();
  const localTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  if (!this.createdAt) {
    this.createdAt = localTime;
  }
  this.updatedAt = localTime;
  next();
});

const OrderModel = model<Torder>('Order', orderSchema);
export default OrderModel;
