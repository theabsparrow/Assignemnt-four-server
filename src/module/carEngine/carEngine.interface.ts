export type TFuelType =
  | 'Petrol'
  | 'Diesel'
  | 'Electric'
  | 'Hybrid'
  | 'CNG'
  | 'LPG'
  | 'Hydrogen';

export type TEngine =
  | '1.5L 3-cylinder'
  | '2.0L 4-cylinder'
  | '2.5L 4-cylinder'
  | '3.0L V6'
  | '3.5L V6'
  | '4.0L V8'
  | 'Hybrid'
  | 'Electric Motor'
  | 'Turbocharged';

export type TTransmission =
  | 'Automatic'
  | 'Manual'
  | 'CVT'
  | 'Dual-Clutch'
  | 'Semi-Automatic'
  | 'Electric Drive';

export type TDriveTrain = 'FWD' | 'RWD' | 'AWD' | '4WD' | 'All-Wheel Drive';
export type THorsePower =
  | '100'
  | '150'
  | '200'
  | '250'
  | '300'
  | '350'
  | '400'
  | '450'
  | '500'
  | '600+';
export type TTorque =
  | '100'
  | '150'
  | '200'
  | '250'
  | '300'
  | '350'
  | '400'
  | '450'
  | '500'
  | '600'
  | '700'
  | '800+';

export type TTopSpeed =
  | '120'
  | '150'
  | '180'
  | '200'
  | '220'
  | '240'
  | '260'
  | '280'
  | '300+';
export type TAccelaration =
  | '3.5'
  | '4.0'
  | '4.5'
  | '5.0'
  | '5.5'
  | '6.0'
  | '6.5'
  | '7.0'
  | '7.5'
  | '8.0+';

export type TCarEngine = {
  engine: TEngine;
  transmission: TTransmission;
  mileage: string;
  fuelType: TFuelType;
  driveTrain: TDriveTrain;
  horsePower: THorsePower;
  torque: TTorque;
  topSpeed: TTopSpeed;
  acceleration: TAccelaration;
};
