import { Types } from 'mongoose';
import { TRegistrationdata } from '../registrationData/registrationData.interface';
import { TSafetyFeature } from '../safetyFeatures/safetyFeature.interface';
import { TserviceHistory } from '../serviceHistory/serviceHistory.interface';
import { TDeliveryAndPayment } from '../carDelivery/carDelivery.interface';
import { TCarEngine } from '../carEngine/carEngine.interface';

export type TCarBrand =
  | 'Toyota'
  | 'Hyundai'
  | 'Nissan'
  | 'Audi'
  | 'Tesla'
  | 'Ford'
  | 'Land Rover'
  | 'Honda'
  | 'Suzuki'
  | 'Mitsubishi'
  | 'BMW'
  | 'Mercedes Benz'
  | 'Volkswagen'
  | 'Chevrolet'
  | 'Lexus'
  | 'Jaguar'
  | 'Kia'
  | 'Mazda'
  | 'Subaru'
  | 'Bentley'
  | 'Peugeot'
  | 'Renault'
  | 'Volvo'
  | 'Jeep'
  | 'Chrysler'
  | 'Dodge'
  | 'Cadillac'
  | 'GMC'
  | 'Acura'
  | 'Infiniti'
  | 'Alfa Romeo'
  | 'Maserati'
  | 'Lincoln'
  | 'Citroën'
  | 'Fiat'
  | 'Mini'
  | 'Skoda'
  | 'Genesis'
  | 'RAM'
  | 'Hummer'
  | 'Saab'
  | 'Seat'
  | 'Proton'
  | 'Tata'
  | 'Opel';

export type TCategory =
  | 'Sedan'
  | 'SUV'
  | 'Coupe'
  | 'Convertible'
  | 'Electric'
  | 'Sports Car'
  | 'Hybrid'
  | 'Jeep'
  | 'Luxury'
  | 'Hatchback'
  | 'Pickup Truck'
  | 'Van'
  | 'Minivan'
  | 'Wagon'
  | 'Crossover'
  | 'Muscle Car'
  | 'Roadster'
  | 'Diesel'
  | 'Off-Road'
  | 'Supercar'
  | 'Classic Car'
  | 'Limousine'
  | 'Station Wagon'
  | 'Microcar'
  | 'Targa Top'
  | 'Camper Van'
  | 'Utility Vehicle'
  | 'Compact Car'
  | 'Pony Car';

export type TSeatingCapacity = '2' | '4' | '5' | '6' | '7' | '8' | '9' | '10+';
export type TCondition = 'New' | 'Used' | 'Certified Pre-Owned';
export type TCar = {
  carEngine: Types.ObjectId;
  deliveryAndPayment: Types.ObjectId;
  registrationData: Types.ObjectId;
  serviceHistory?: Types.ObjectId;
  safetyFeature?: Types.ObjectId;
  user: Types.ObjectId;
  brand: TCarBrand;
  model: string;
  year: string;
  price: number;
  category: TCategory;
  color: string;
  description?: string;
  inStock: boolean;
  condition: TCondition;
  seatingCapacity: TSeatingCapacity;
  madeIn: string;
  negotiable: boolean;
  image: string;
  galleryImage?: string[];
  carBrandLogo: string;
  isDeleted: boolean;
};

export type TcarInfoPayload = {
  basicInfo: TCar;
  engineInfo: TCarEngine;
  deliveryAndPayment: TDeliveryAndPayment;
  registrationData: TRegistrationdata;
  safetyFeature?: TSafetyFeature;
  serviceHistory?: TserviceHistory;
};

export type TUpdateCarInfo = {
  brand: TCarBrand;
  carBrandLogo: string;
  model: string;
  year: string;
  price: number;
  category: TCategory;
  color: string;
  description: string;
  condition: TCondition;
  seatingCapacity: TSeatingCapacity;
  madeIn: string;
  image: string;
  negotiable: boolean;
  inStock: boolean;
  addGalleryImage: string[];
  removeGalleryImage: string[];
};
