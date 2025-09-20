import { z } from 'zod';
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
import { engineInfoValidationSchema } from '../carEngine/carEngine.validation';
import { registrationDataValidationSchema } from '../registrationData/registrationData.validation';
import { safetyFeatureValidationSchema } from '../safetyFeatures/safetyFeature.validation';
import { serviceHistoryValidationSchema } from '../serviceHistory/serviceHistory.validation';
// car image validation schema
const carImageGallerySchema = z.object({
  url: z.string().url({ message: 'Invalid URL format' }),
});
// delivery method validation schema
const deliveryMethodValidationSchema = z.object({
  method: z.enum([...methods] as [string, ...string[]]),
  estimatedTime: z.enum([...estimatedTimes] as [string, ...string[]]),
  deliveryCost: z.number().max(50000, {
    message: 'delivery cost can`t be more than fifty thousands',
  }),
});
// payment method validation schema
const paymentMethodValidationSchema = z.object({
  method: z.enum([...paymentMethod] as [string, ...string[]]),
});
// payment options validation schema
const paymentOptionValidationSchema = z.object({
  option: z.enum([...paymentOptions] as [string, ...string[]]),
});
// car validation schema
export const carValidationSchema = z.object({
  basicInfo: z.object({
    brand: z.enum([...carBrand] as [string, ...string[]], {
      required_error: 'Car brand is required',
    }),
    model: z
      .string()
      .min(1, { message: 'Car model must be at least 1 character' })
      .max(25, { message: 'Car model must be less than 25 characters' })
      .nonempty({ message: 'Car model is required' }),
    year: z.string().max(new Date().getFullYear(), {
      message: 'Year cannot be in the future',
    }),
    price: z.number().min(1, { message: 'Price is required' }),
    category: z.enum([...carCategory] as [string, ...string[]], {
      required_error: 'Category is required',
    }),
    condition: z.enum([...condition] as [string, ...string[]], {
      required_error: 'condition is required',
    }),
    color: z
      .string()
      .min(3, { message: 'min character should be 3' })
      .max(15, { message: 'max character should be 30' }),
    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters' })
      .nonempty({ message: 'Description is required' }),
    madeIn: z.string().nonempty({ message: 'Made in is required' }),
    country: z.string().nonempty({ message: 'Country is required' }),
    image: z.string().url({ message: 'Invalid image URL' }),
    galleryImage: z
      .array(carImageGallerySchema)
      .max(5, { message: 'You can upload a maximum of 5 images' })
      .optional(),
    seatingCapacity: z.enum([...seatingCapacity] as [string, ...string[]], {
      required_error: 'Seating capacity is required',
    }),
    paymentMethod: z.array(paymentMethodValidationSchema),
    paymentOption: z.array(paymentOptionValidationSchema).optional(),
    deliveryMethod: z.array(deliveryMethodValidationSchema),
  }),
  engineInfo: engineInfoValidationSchema,
  registrationData: registrationDataValidationSchema,
  safetyFeature: safetyFeatureValidationSchema.optional(),
  serviceHistory: serviceHistoryValidationSchema.optional(),
});

// update car validation schema
const updateCArInfoValidationSchema = z.object({
  brand: z.enum([...carBrand] as [string, ...string[]]).optional(),
  model: z
    .string()
    .min(1, { message: 'Car model must be at least 1 character' })
    .max(25, { message: 'Car model must be less than 25 characters' })
    .optional(),
  year: z
    .string()
    .max(new Date().getFullYear(), {
      message: 'Year cannot be in the future',
    })
    .optional(),
  price: z.string().optional(),
  category: z.enum([...carCategory] as [string, ...string[]]).optional(),
  condition: z
    .enum([...condition] as [string, ...string[]], {
      required_error: 'condition is required',
    })
    .optional(),
  color: z
    .string()
    .min(3, { message: 'min character should be 3' })
    .max(15, { message: 'max character should be 30' })
    .optional(),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' })
    .optional(),
  madeIn: z.string().optional(),
  country: z.string().optional(),
  seatingCapacity: z
    .enum([...seatingCapacity] as [string, ...string[]])
    .optional(),
  image: z.string().url({ message: 'Invalid image URL' }).optional(),
});

const updateCarImageValidationSchema = z.object({
  galleryImage: z
    .array(carImageGallerySchema)
    .max(5, { message: 'You can upload a maximum of 5 images' }),
});

export const carValidation = {
  carValidationSchema,
  updateCArInfoValidationSchema,
  updateCarImageValidationSchema,
};
