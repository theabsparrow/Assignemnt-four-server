export type TLogin = {
  email: string;
  password: string;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type TJwtPayload = {
  userId: string;
  userRole: string;
};
