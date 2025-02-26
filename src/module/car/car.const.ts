export const carBrand: string[] = [
  'Toyota',
  'Hyundai',
  'Nissan',
  'Audi',
  'Tesla',
  'Ford',
  'Land-rover',
  'Honda',
  'Suzuki',
  'Mitsubishi',
] as const;

export const carCategory: string[] = [
  'Sedan',
  'SUV',
  'Coupe',
  'Convertible',
  'Electric',
  'Sports-car',
  'Hybrid',
  'Jeep',
  'Luxury',
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

type TCarBrandLogo = Record<string, unknown>;
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
