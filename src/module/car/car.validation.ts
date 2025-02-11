import { z } from 'zod';
import { carBrand, carCategory, seatingCapacity } from './car.const';
// import {
//   accelaration,
//   driveTrain,
//   engine,
//   fuelType,
//   horsePower,
//   topSpeed,
//   torque,
//   transmission,
// } from '../carEngine/carEngine.const';
// import { features, warranty } from '../safetyFeatures/safetyFeature.const';

const carImageGallerySchema = z.object({
  url: z.string().url({ message: 'Invalid URL format' }),
  title: z.string().min(1, { message: 'Title is required' }),
  isDeleted: z.boolean(),
});

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
    year: z
      .number()
      .min(2010, { message: 'Year must be after 2010' })
      .max(new Date().getFullYear(), {
        message: 'Year cannot be in the future',
      }),
    price: z.string().nonempty({ message: 'Price is required' }),
    category: z.enum([...carCategory] as [string, ...string[]], {
      required_error: 'Category is required',
    }),
    color: z
      .array(z.string())
      .min(1, { message: 'At least one color is required' }),
    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters' })
      .nonempty({ message: 'Description is required' }),
    quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
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
  }),
  // engineInfo: z.object({
  //   engine: z.enum([...engine] as [string, ...string[]], {
  //     required_error: 'Engine is required',
  //   }),
  //   transmission: z.enum([...transmission] as [string, ...string[]], {
  //     required_error: 'Transmission is required',
  //   }),
  //   mileage: z.string().nonempty({ message: 'Mileage is required' }),
  //   fuelType: z.enum([...fuelType] as [string, ...string[]], {
  //     required_error: 'Fuel type is required',
  //   }),
  //   driveTrain: z.enum([...driveTrain] as [string, ...string[]], {
  //     required_error: 'Drive train is required',
  //   }),
  //   horsePower: z.enum([...horsePower] as [string, ...string[]], {
  //     required_error: 'Horsepower is required',
  //   }),
  //   torque: z.enum([...torque] as [string, ...string[]], {
  //     required_error: 'Torque is required',
  //   }),
  //   topSpeed: z.enum([...topSpeed] as [string, ...string[]], {
  //     required_error: 'Top speed is required',
  //   }),
  //   acceleration: z.enum([...accelaration] as [string, ...string[]], {
  //     required_error: 'Acceleration is required',
  //   }),
  // }),
  // registrationData: z.object({
  //   licensePlate: z
  //     .string()
  //     .trim()
  //     .min(1, { message: 'License plate is required' })
  //     .max(20, { message: 'License plate cannot exceed 20 characters' }),
  //   vin: z
  //     .string()
  //     .trim()
  //     .min(1, { message: 'VIN (Vehicle Identification Number) is required' })
  //     .max(17, { message: 'VIN cannot exceed 17 characters' }),
  //   registrationYear: z
  //     .string()
  //     .min(4, {
  //       message: 'Registration year must be 4 characters (e.g., 2022)',
  //     })
  //     .max(4, {
  //       message: 'Registration year must be 4 characters (e.g., 2022)',
  //     }),
  //   registrationAuthority: z
  //     .string()
  //     .trim()
  //     .min(1, { message: 'Registration authority is required' }),
  //   previousOwner: z
  //     .string()
  //     .trim()
  //     .min(1, { message: 'Previous owner is required' }),
  //   previousOwnerAddress: z
  //     .string()
  //     .trim()
  //     .min(1, { message: 'Previous owner address is required' }),
  //   registrationCountry: z
  //     .string()
  //     .trim()
  //     .min(1, { message: 'Registration country is required' }),
  // }),
  // safetyFeature: z.object({
  //   safetyRating: z
  //     .number()
  //     .min(1, { message: 'Safety rating must be at least 1' })
  //     .max(5, { message: 'Safety rating cannot exceed 5' })
  //     .refine((val) => [1, 2, 3, 4, 5].includes(val), {
  //       message: 'Invalid safety rating',
  //     }),

  //   airbags: z
  //     .number()
  //     .min(1, { message: 'Airbags must be at least 1' })
  //     .max(10, { message: 'Airbags cannot exceed 10' })
  //     .refine((val) => [1, 2, 4, 6, 8, 10].includes(val), {
  //       message: 'Invalid number of airbags',
  //     }),

  //   features: z
  //     .array(z.string())
  //     .min(1, { message: 'At least one feature is required' })
  //     .refine((val) => val.every((feature) => features.includes(feature)), {
  //       message: 'Invalid feature found',
  //     }),

  //   warranty: z.string().refine((val) => warranty.includes(val), {
  //     message: 'Invalid warranty type',
  //   }),
  // }),
  // serviceHistory: z.object({
  //   serviceDate: z.string().min(1, { message: 'Service date is required' }),
  //   serviceCenter: z
  //     .string()
  //     .min(1, { message: 'Service center is required' })
  //     .trim(),

  //   serviceDetails: z
  //     .string()
  //     .min(1, { message: 'Service details are required' })
  //     .trim(),

  //   cost: z.number().min(0, { message: 'Cost cannot be negative' }),

  //   mileageAtService: z
  //     .number()
  //     .min(0, { message: 'Mileage cannot be negative' }),
  // }),
});

const updateCArInfoValidationSchema = z.object({
  brand: z.enum([...carBrand] as [string, ...string[]]).optional(),
  model: z
    .string()
    .min(1, { message: 'Car model must be at least 1 character' })
    .max(25, { message: 'Car model must be less than 25 characters' })
    .optional(),
  year: z
    .number()
    .min(2010, { message: 'Year must be after 2010' })
    .max(new Date().getFullYear(), {
      message: 'Year cannot be in the future',
    })
    .optional(),
  price: z.string().optional(),
  category: z.enum([...carCategory] as [string, ...string[]]).optional(),
  color: z.array(z.string()).optional(),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' })
    .optional(),
  madeIn: z.string().optional(),
  country: z.string().optional(),
  seatingCapacity: z
    .enum([...seatingCapacity] as [string, ...string[]])
    .optional(),
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
