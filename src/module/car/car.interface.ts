import { Types } from 'mongoose';

export type TCarBrand =
  | 'Toyota'
  | 'Hyundai'
  | 'Nissan'
  | 'Audi'
  | 'Tesla'
  | 'Ford'
  | 'Land-rover'
  | 'Honda'
  | 'Suzuki'
  | 'Mitsubishi';

export type TCategory =
  | 'Sedan'
  | 'SUV'
  | 'Coupe'
  | 'Convertible'
  | 'Electric'
  | 'Sports-car'
  | 'Hybrid'
  | 'Jeep'
  | 'Luxury';

export type TGalleryImage = {
  url: string;
  title: string;
  isDeleted: boolean;
};
export type TSeatingCapacity = '2' | '4' | '5' | '6' | '7' | '8' | '9' | '10+';
export type TCondition = 'New' | 'Used' | 'Certified Pre-Owned';

export type TCar = {
  // basic car info
  carEngine?: Types.ObjectId;
  registrationData?: Types.ObjectId;
  serviceHistory?: Types.ObjectId;
  safetyFeature?: Types.ObjectId;
  brand: TCarBrand;
  model: string;
  year: number;
  price: number;
  category: TCategory;
  color: string[];
  description: string;
  quantity: number;
  inStock: boolean;
  // condition: TCondition;
  seatingCapacity: TSeatingCapacity;
  madeIn: string;
  country: string;
  // car image
  image: string;
  galleryImage?: TGalleryImage[];
  carBrandLogo: string;
};
