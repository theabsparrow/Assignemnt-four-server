import { USER_ROLE } from './user.constant';

export type TUSerName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TUser = {
  name: TUSerName;
  email: string;
  password: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'others';
  dateOfBirth: string;
  profileImage?: string;
  coverImage?: string;
  status: 'active' | 'deactive';
  role: 'user' | 'admin' | 'superAdmin';
  homeTown?: string;
  currentAddress?: string;
  verifyWithEmail: boolean;
  isDeleted: boolean;
  passwordChangedAt?: Date;
};

export type TUserStatus = {
  status: string;
  userRole: string;
};

export type TUSerRole = keyof typeof USER_ROLE;
