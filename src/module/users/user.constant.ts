export const USER_ROLE = {
  admin: 'admin',
  user: 'user',
  superAdmin: 'superAdmin',
} as const;

export const searchableFields: string[] = [
  'email',
  'phoneNumber',
  'name.firstName',
  'name.lastName',
  'name.middleName',
] as const;
