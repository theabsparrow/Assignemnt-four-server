import {
  TAirbags,
  TFeature,
  TSafetyRating,
  TWarranty,
} from './safetyFeature.interface';

export const safetyRating: TSafetyRating[] = ['1', '2', '3', '4', '5'] as const;

export const airBags: TAirbags[] = ['2', '4', '6', '8', '10', '12'] as const;

export const features: TFeature[] = [
  'ABS',
  'Cruise Control',
  'Rear Camera',
  'Sunroof',
  'Lane Assist',
  'Blind Spot Monitoring',
  'Heated Seats',
  'Navigation System',
  'Parking Sensors',
  'Keyless Entry',
  'Automatic Emergency Braking',
  'Adaptive Cruise Control',
  'Wireless Charging',
  'Apple CarPlay',
  'Android Auto',
] as const;

export const warranty: TWarranty[] = [
  '1 Year',
  '2 Years',
  '3 Years',
  '4 Years',
  '5 Years',
  '6 Years',
  '7 Years',
  '8 Years',
  '10 Years',
] as const;
