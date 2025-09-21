export type TSafetyRating = 1 | 2 | 3 | 4 | 5;
export type TAirbags = 2 | 4 | 6 | 8 | 10 | 12;
export type TFeature =
  | 'ABS'
  | 'Cruise Control'
  | 'Rear Camera'
  | 'Sunroof'
  | 'Lane Assist'
  | 'Blind Spot Monitoring'
  | 'Heated Seats'
  | 'Navigation System'
  | 'Parking Sensors'
  | 'Keyless Entry'
  | 'Automatic Emergency Braking'
  | 'Adaptive Cruise Control'
  | 'Wireless Charging'
  | 'Apple CarPlay'
  | 'Android Auto';

export type TWarranty =
  | '1 Year'
  | '2 Years'
  | '3 Years'
  | '4 Years'
  | '5 Years'
  | '6 Years'
  | '7 Years'
  | '8 Years'
  | '10 Years';

export type TSafetyFeature = {
  safetyRating: TSafetyRating;
  airbags: TAirbags;
  features: TFeature[];
  warranty: TWarranty;
  isDeleted: boolean;
};
