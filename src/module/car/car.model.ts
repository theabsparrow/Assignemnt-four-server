import { Schema, model } from 'mongoose';
import { TCar, TGalleryImage } from './car.interface';
import { carBrand, carCategory, condition, seatingCapacity } from './car.const';

const carImageGallerySchema = new Schema<TGalleryImage>({
  url: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const carSchema = new Schema<TCar>(
  {
    carEngine: {
      type: Schema.Types.ObjectId,
      ref: 'CarEngine',
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
    brand: {
      type: String,
      required: [true, 'Car Brand name is required'],
      enum: carBrand,
    },
    model: {
      type: String,
      required: [true, 'Car model name is required'],
      trim: true,
      unique: true,
    },
    year: {
      type: String,
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
      required: true,
      trim: true,
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
    country: {
      type: String,
      required: [true, 'country is required'],
    },
    // car image schema
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
    seatingCapacity: {
      type: String,
      enum: seatingCapacity,
      required: [true, 'seating capacity is required'],
    },
  },
  {
    timestamps: true,
  },
);

const Car = model<TCar>('Car', carSchema);
export default Car;
