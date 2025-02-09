import config from '../config';
import { USER_ROLE } from '../module/users/user.constant';
import { User } from '../module/users/user.model';
import { calculateAge } from '../module/users/user.utills';

type TSuperAdminName = {
  firstName: string;
  middleName: string;
  lastName: string;
};
type TSuperAdmin = {
  name: TSuperAdminName;
  email: string;
  phoneNumber: string;
  password: string;
  dateOfBirth: string;
  age?: number;
  gender: string;
  role: string;
  verifyWithEmail: boolean;
};

const superAdmin: TSuperAdmin = {
  name: {
    firstName: config.super_admin_first_name as string,
    middleName: config.super_admin_middle_name as string,
    lastName: config.super_admin_last_name as string,
  },
  email: config.super_admin_email as string,
  phoneNumber: config.super_admin_phone as string,
  password: config.super_admin_pass as string,
  dateOfBirth: config.super_admin_birth as string,
  gender: 'others',
  role: USER_ROLE.superAdmin,
  verifyWithEmail: true,
};

const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({
    role: USER_ROLE.superAdmin,
  });
  if (!isSuperAdminExists) {
    superAdmin.age = calculateAge(superAdmin.dateOfBirth as string);
    await User.create(superAdmin);
  }
};

export default seedSuperAdmin;
