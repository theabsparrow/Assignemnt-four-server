import { Types } from 'mongoose';

type TCarBrand =
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
  | 'Porsche'
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
  | 'Seat';

type TCategory =
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

export type TGalleryImage = {
  url: string;
};
export type TSeatingCapacity = '2' | '4' | '5' | '6' | '7' | '8' | '9' | '10+';
export type TCondition = 'New' | 'Used' | 'Certified Pre-Owned';
export type TPaymentMethod = {
  method: 'Cash on Delivery' | 'Online Payment';
  isDeleted: boolean;
};
export type TPaymentOptions = {
  option: 'SSLCommerz' | 'Stripe' | 'SurjoPay';
  isDeleted: boolean;
};

export type TMethod = 'Home Delivery' | 'Pickup' | 'Express Delivery';

export type TEstimatedTime =
  | '24 hours'
  | '2 days'
  | '5 days'
  | '6 days'
  | '8 days'
  | '9 days'
  | '10 days';

export type TDeliveryMethod = {
  method: TMethod;
  estimatedTime: TEstimatedTime;
  deliveryCost: number;
  isDeleted: boolean;
};

export type TCar = {
  // basic car info
  carEngine?: Types.ObjectId;
  registrationData?: Types.ObjectId;
  serviceHistory?: Types.ObjectId;
  safetyFeature?: Types.ObjectId;
  brand: TCarBrand;
  model: string;
  year: string;
  price: number;
  category: TCategory;
  color: string;
  description: string;
  inStock: boolean;
  condition: TCondition;
  seatingCapacity: TSeatingCapacity;
  madeIn: string;
  country: string;
  // car image
  image: string;
  galleryImage?: TGalleryImage[];
  // delivery and payment
  paymentMethod: TPaymentMethod[];
  paymentOption: TPaymentOptions[];
  deliveryMethod: TDeliveryMethod[];
  carBrandLogo: string;
};
