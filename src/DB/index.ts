import config from '../config';
import { USER_ROLE } from '../module/users/user.constant';
import { User } from '../module/users/user.model';

const superAdmin = {
  name: {
    firstName: config.super_admin_first_name,
    middleName: config.super_admin_middle_name,
    lastName: config.super_admin_last_name,
  },
  email: config.super_admin_email,
  phoneNumber: config.super_admin_phone,
  password: config.super_admin_pass,
  dateOfBirth: config.super_admin_birth,
  gender: 'others',
  role: USER_ROLE.superAdmin,
  verifyWithEmail: true,
};

const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({
    role: USER_ROLE.superAdmin,
  });
  if (!isSuperAdminExists) {
    await User.create(superAdmin);
  }
};

export default seedSuperAdmin;
