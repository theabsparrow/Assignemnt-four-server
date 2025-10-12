import { z } from 'zod';
import {
  carBrand,
  carCategory,
  condition,
  seatingCapacity,
  years,
} from './car.const';
import { engineInfoValidation } from '../carEngine/carEngine.validation';
import { registrationDataValidation } from '../registrationData/registrationData.validation';
import { safetyFeatureValidation } from '../safetyFeatures/safetyFeature.validation';
import { serviceHistoryValidation } from '../serviceHistory/serviceHistory.validation';
import { deliveryAndPaymentValidation } from '../carDelivery/carDelivery.validation';

// car validation schema
export const carValidationSchema = z.object({
  basicInfo: z.object({
    brand: z.enum([...carBrand] as [string, ...string[]], {
      required_error: 'Car brand is required',
    }),
    model: z
      .string()
      .min(1, { message: 'Car model must be at least 1 character' })
      .max(50, { message: 'Car model must be less than 50 characters' })
      .trim(),
    year: z.enum([...years] as [string, ...string[]], {
      required_error: 'year is required',
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
      .max(500, { message: 'Description can`t be more that 500 character' })
      .trim()
      .optional(),
    madeIn: z.string().nonempty({ message: 'Made in is required' }),
    image: z.string().url({ message: 'Invalid image URL' }),
    galleryImage: z
      .array(
        z.string({ invalid_type_error: 'images should be string url' }).url(),
      )
      .max(5, { message: 'You can upload a maximum of 5 images' })
      .optional(),
    seatingCapacity: z.enum([...seatingCapacity] as [string, ...string[]], {
      required_error: 'Seating capacity is required',
    }),
  }),
  engineInfo: engineInfoValidation.engineInfoValidationSchema,
  deliveryAndPayment:
    deliveryAndPaymentValidation.deliveryAndPaymentValidationSchema,
  registrationData: registrationDataValidation.registrationDataValidationSchema,
  safetyFeature:
    safetyFeatureValidation.safetyFeatureValidationSchema.optional(),
  serviceHistory:
    serviceHistoryValidation.serviceHistoryValidationSchema.optional(),
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
    .enum([...years] as [string, ...string[]], {
      required_error: 'year is required',
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
    .max(500, { message: 'Description can`t be more that 500 character' })
    .trim()
    .optional(),
  madeIn: z.string().optional(),
  seatingCapacity: z
    .enum([...seatingCapacity] as [string, ...string[]])
    .optional(),
  image: z.string().url({ message: 'Invalid image URL' }).optional(),
  addGalleryImage: z
    .array(
      z.string({ invalid_type_error: 'images should be string url' }).url(),
    )
    .max(5, { message: 'You can upload a maximum of 5 images' })
    .optional(),
  removeGalleryImage: z
    .array(
      z.string({ invalid_type_error: 'images should be string url' }).url(),
    )
    .max(5, { message: 'You can upload a maximum of 5 images' })
    .optional(),
});

export const carValidation = {
  carValidationSchema,
  updateCArInfoValidationSchema,
};
