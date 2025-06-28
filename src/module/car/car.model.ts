import { Schema, model } from 'mongoose';
import {
  TCar,
  TDeliveryMethod,
  TGalleryImage,
  TPaymentMethod,
  TPaymentOptions,
} from './car.interface';
import {
  carBrand,
  carCategory,
  condition,
  estimatedTimes,
  methods,
  paymentMethod,
  paymentOptions,
  seatingCapacity,
} from './car.const';

const carImageGallerySchema = new Schema<TGalleryImage>({
  url: {
    type: String,
  },
});
const deliveryMethodSchema = new Schema<TDeliveryMethod>({
  method: {
    type: String,
    enum: methods,
    required: [true, 'delivery method is required'],
  },
  estimatedTime: {
    type: String,
    enum: estimatedTimes,
    required: [true, 'estimated time is required'],
  },
  deliveryCost: {
    type: Number,
    required: [true, 'delivery cost is required'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const paymentMethodSchema = new Schema<TPaymentMethod>({
  method: {
    type: String,
    required: [true, 'minimum one payment method is required'],
    enum: paymentMethod,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const paymentOptionSchema = new Schema<TPaymentOptions>({
  option: {
    type: String,
    required: [true, 'minimum one payment option is required'],
    enum: paymentOptions,
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
      max: [25, 'model can`t be more than 25 character'],
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
    paymentMethod: {
      type: [paymentMethodSchema],
      required: [true, 'payment methods are required'],
    },
    paymentOption: {
      type: [paymentOptionSchema],
    },
    deliveryMethod: {
      type: [deliveryMethodSchema],
      required: [true, 'deliveryMethods are required'],
    },
  },
  {
    timestamps: true,
  },
);

const Car = model<TCar>('Car', carSchema);
export default Car;
