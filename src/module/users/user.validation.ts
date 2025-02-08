import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(30, { message: 'first  name can`t be more than 30 character' }),
  middleName: z
    .string()
    .max(30, { message: 'middle name can`t be more than 30 character' })
    .optional(),
  lastName: z
    .string()
    .max(30, { message: 'last name can`t be more than 30 character' }),
});

const userValidationSchema = z.object({
  name: userNameValidationSchema,
  email: z.string().email(),
  password: z
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
  phoneNumber: z
    .string()
    .min(14, { message: 'phone number can`t be less than 14 character' })
    .max(14, { message: 'phone number can`t be more than 14 character' })
    .refine((value) => /^\+880\d{10}$/.test(value), {
      message: 'password shpould be start with +880',
    }),
  gender: z.enum(['male', 'female', 'others'] as [string, ...string[]]),
  dateOfBirth: z.string({
    invalid_type_error: 'date must be string',
  }),
  profileImage: z.string().optional(),
});

const userStatusValidationSchema = z.object({
  status: z.enum(['active', 'deactive'] as [string, ...string[]]),
});
const userRoleValidationSchema = z.object({
  role: z.enum(['user', 'admin'] as [string, ...string[]]),
});
export const userValidation = {
  userValidationSchema,
  userStatusValidationSchema,
  userRoleValidationSchema,
};
