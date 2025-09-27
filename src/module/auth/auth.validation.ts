import { z } from 'zod';

const loginValidationSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'password can`t be less than 6 character' })
    .max(20, { message: 'password can`t be more than 20 character' }),
});

const changePassowrdValidationSchema = z.object({
  oldPassword: z
    .string()
    .min(6, { message: 'password can`t be less than 6 character' })
    .max(20, { message: 'password can`t be more than 20 character' }),
  newPassword: z
    .string()
    .min(6, { message: 'password can`t be less than 6 character' })
    .max(20, { message: 'password can`t be more than 20 character' })
    .refine(
      (value) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(value),
      {
        message:
          'password must be contain one capital letter, one small letter, one number and one special chareacter ',
      },
    ),
});

const accessTokenGeneratorValidationSchema = z.object({
  refreshToken: z.string({
    invalid_type_error: 'refresh token must be a string',
  }),
});

const forgetPasswordValidationSchema = z.object({
  email: z.string().email(),
});

const sendOtpValidationSchema = z.object({
  id: z.string({ required_error: 'id is required' }),
});

const resetPasswordValidationSchema = z.object({
  otp: z
    .string()
    .min(6, { message: 'otp can`t be less than 6 character' })
    .max(6, { message: 'otp can`t be more than 6 character' }),
});

const setNewPasswordValidationSchema = z.object({
  newPassword: z
    .string()
    .min(6, { message: 'password can`t be less than 6 character' })
    .max(20, { message: 'password can`t be more than 20 character' })
    .refine(
      (value) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(value),
      {
        message:
          'password must be contain one capital letter, one small letter, one number and one special chareacter ',
      },
    ),
});

export const authValidation = {
  loginValidationSchema,
  changePassowrdValidationSchema,
  accessTokenGeneratorValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
  setNewPasswordValidationSchema,
  sendOtpValidationSchema,
};
