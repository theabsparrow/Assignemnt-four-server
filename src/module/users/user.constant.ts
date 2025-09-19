import { TGender } from './user.interface';

export const USER_ROLE = {
  admin: 'admin',
  user: 'user',
  superAdmin: 'superAdmin',
} as const;

export const gender: TGender[] = ['male', 'female', 'others'];

export const searchableFields: string[] = [
  'email',
  'phoneNumber',
  'name.firstName',
  'name.lastName',
  'name.middleName',
] as const;
