import { CookieOptions } from 'express';
import config from '../../config';

export const cookieOptions: CookieOptions = {
  secure: config.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'none',
  maxAge: 1000 * 60 * 60 * 24 * 365,
} as const;
