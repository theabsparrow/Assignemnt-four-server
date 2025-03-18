export const carBrand: string[] = [
  'Toyota',
  'Hyundai',
  'Nissan',
  'Audi',
  'Tesla',
  'Ford',
  'Land Rover',
  'Honda',
  'Suzuki',
  'Mitsubishi',
  'BMW',
  'Mercedes Benz',
  'Volkswagen',
  'Porsche',
  'Chevrolet',
  'Lexus',
  'Jaguar',
  'Kia',
  'Mazda',
  'Subaru',
  'Bentley',
  'Peugeot',
  'Renault',
  'Volvo',
  'Jeep',
  'Chrysler',
  'Dodge',
  'Cadillac',
  'GMC',
  'Acura',
  'Infiniti',
  'Alfa Romeo',
  'Maserati',
  'Lincoln',
  'Citroën',
  'Fiat',
  'Mini',
  'Skoda',
  'Genesis',
  'RAM',
  'Hummer',
  'Saab',
  'Seat',
] as const;

export const carCategory: string[] = [
  'Sedan',
  'SUV',
  'Coupe',
  'Convertible',
  'Electric',
  'Sports Car',
  'Hybrid',
  'Jeep',
  'Luxury',
  'Hatchback',
  'Pickup Truck',
  'Van',
  'Minivan',
  'Wagon',
  'Crossover',
  'Muscle Car',
  'Roadster',
  'Diesel',
  'Off-Road',
  'Supercar',
  'Classic Car',
  'Limousine',
  'Station Wagon',
  'Microcar',
  'Targa Top',
  'Camper Van',
  'Utility Vehicle',
  'Compact Car',
  'Pony Car',
] as const;

export const condition: string[] = [
  'New',
  'Used',
  'Certified Pre-Owned',
] as const;

export const seatingCapacity: string[] = [
  '2',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10+',
] as const;
export const paymentMethod: string[] = [
  'Cash on Delivery',
  'Online Payment',
] as const;
export const paymentOptions: string[] = [
  'SSLCommerz',
  'Stripe',
  'SurjoPay',
] as const;

export const methods: string[] = [
  'Home Delivery',
  'Pickup',
  'Express Delivery',
];
export const estimatedTimes: string[] = [
  '24 hours',
  '2 days',
  '5 days',
  '6 days',
  '8 days',
  '9 days',
  '10 days',
];

type TCarBrandLogo = Record<string, string>;
export const carBrandLogo: TCarBrandLogo = {
  Audi: 'https://i.ibb.co.com/twsHWLjS/audi.png',
  Ford: 'https://i.ibb.co.com/rXJfkMD/ford.png',
  Honda: 'https://i.ibb.co.com/xKBRH0cH/honda.png',
  Hyundai: 'https://i.ibb.co.com/MxYKvwph/hyundai.png',
  'Land-rover': 'https://i.ibb.co.com/Kx44z8tT/land-rover.png',
  Mitsubishi: 'https://i.ibb.co.com/yFbhpqK1/mitsubishi.png',
  Nissan: 'https://i.ibb.co.com/QvHRZwcx/nisaan.png',
  Suzuki: 'https://i.ibb.co.com/KxKNWFC2/suzuki.png',
  Tesla: 'https://i.ibb.co.com/Ng9dbzQ8/tesla.png',
  Toyota: 'https://i.ibb.co.com/wfx5cHj/toyota.png',
} as const;

export const carSearchAbleFields = ['brand', 'model', 'country', 'category'];
