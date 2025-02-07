import jwt, { SignOptions } from 'jsonwebtoken';
type TJwtPayload = {
  userEmail: string;
  userRole: string;
};

export const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  });
};
