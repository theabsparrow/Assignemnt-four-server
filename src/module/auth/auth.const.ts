import { CookieOptions } from 'express';
import config from '../../config';

export const cookieOptions: CookieOptions = {
  secure: config.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 1000 * 60 * 60 * 24 * 365,
} as const;
