import { Schema, model } from 'mongoose';
import { TCar, TGalleryImage } from './car.interface';
import {
  carBrand,
  carCategory,
  condition,
  seatingCapacity,
  years,
} from './car.const';

const carImageGallerySchema = new Schema<TGalleryImage>({
  url: {
    type: String,
  },
});

const carSchema = new Schema<TCar>(
  {
    carEngine: {
      type: Schema.Types.ObjectId,
      ref: 'CarEngine',
      required: [true, 'engine information is required'],
    },
    deliveryAndPayment: {
      type: Schema.Types.ObjectId,
      ref: 'DeliveryAndPayment',
      required: [true, 'delivery and payment information is required'],
    },
    registrationData: {
      type: Schema.Types.ObjectId,
      ref: 'RegistrationData',
    },
    serviceHistory: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceHistory',
    },
    safetyFeature: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceHistory',
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'userId is required'],
      ref: 'User',
    },
    brand: {
      type: String,
      required: [true, 'Car Brand name is required'],
      enum: carBrand,
    },
    model: {
      type: String,
      required: [true, 'Car model name is required'],
      trim: true,
      max: [25, 'model can`t be more than 25 character'],
    },
    year: {
      type: String,
      enum: years,
      required: [true, 'Car manufacturing year is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    category: {
      type: String,
      required: [true, 'Car category is required'],
      enum: carCategory,
    },
    color: {
      type: String,
      required: [true, 'color is required'],
    },
    description: {
      type: String,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    condition: {
      type: String,
      enum: condition,
      required: [true, 'condition is required'],
    },
    madeIn: {
      type: String,
      required: [true, 'made in is required'],
    },
    image: {
      type: String,
      required: [true, 'car image is required'],
    },
    galleryImage: {
      type: [carImageGallerySchema],
      validate: {
        validator: function (value: string[]) {
          return value.length <= 5;
        },
        message: 'You can upload a maximum of 5 images in the gallery.',
      },
    },
    carBrandLogo: {
      type: String,
      required: [true, 'car brand logo is required'],
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    seatingCapacity: {
      type: String,
      enum: seatingCapacity,
      required: [true, 'seating capacity is required'],
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

const Car = model<TCar>('Car', carSchema);
export default Car;
