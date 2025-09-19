import { USER_ROLE } from './user.constant';

export type TUSerName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};
export type TGender = 'male' | 'female' | 'others';
export type TStatus = 'active' | 'deactive';
export type TUSerRole = keyof typeof USER_ROLE;

export type TUser = {
  name: TUSerName;
  email: string;
  password: string;
  phoneNumber: string;
  gender: TGender;
  dateOfBirth: string;
  profileImage?: string;
  coverImage?: string;
  status: TStatus;
  role: TUSerRole;
  homeTown?: string;
  currentAddress?: string;
  verifyWithEmail: boolean;
  isDeleted: boolean;
  passwordChangedAt?: Date;
};

type TUpdatedResult = {
  updateResult: TUser;
};
type TUpdateResult2 = {
  updateResult: TUser;
  access: string;
  refresh: string;
};

export type TUpdatedResultInterface = TUpdatedResult | TUpdateResult2;
