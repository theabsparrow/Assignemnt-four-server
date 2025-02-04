import { Schema, model } from 'mongoose';
import { Tcar } from './car.interface';

const carSchema = new Schema<Tcar>({
  brand: {
    type: String,
    required: [true, 'Car Brand name is required'],
    maxlength: [15, 'Brand name can`t be more than 15 character'],
    minlength: [1, 'Brand name can`t be less than 1 character'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Car model name is required'],
    maxlength: [30, 'Model name can`t be more that 30 character'],
    minlength: [5, 'Model name can`t be less that 5 character'],
    unique: true,
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Car manufacturing year is required'],
    validate: {
      validator: function (value: number) {
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 10;
        return value >= minYear && value <= currentYear;
      },
      message: `{VALUE} is not between  ${new Date().getFullYear() - 10} and ${new Date().getFullYear()}`,
    },
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price must be greater than 0'],
  },
  category: {
    type: String,
    enum: {
      values: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'],
      message:
        "{VALUE} is not valid. It should be anything of the following 'Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible' ",
    },
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: [1000, 'description can`t be more than 1000 character'],
    minlength: [10, 'description can`t be less than 10 character'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is reuired'],
    min: [0, 'quantity can`t be a negative number'],
  },
  inStock: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

carSchema.pre('save', function (this, next) {
  const now = new Date();
  const localTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  if (!this.createdAt) {
    this.createdAt = localTime;
  }
  this.updatedAt = localTime;
  next();
});

carSchema.pre('findOneAndUpdate', function (this, next) {
  const now = new Date();
  const localTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  this.set({ updatedAt: localTime });
  next();
});

const CarModel = model<Tcar>('Car', carSchema);
export default CarModel;
