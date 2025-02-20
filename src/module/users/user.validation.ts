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

const updateUSerNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(30, { message: 'first  name can`t be more than 30 character' })
    .optional(),
  middleName: z
    .string()
    .max(30, { message: 'middle name can`t be more than 30 character' })
    .optional(),
  lastName: z
    .string()
    .max(30, { message: 'last name can`t be more than 30 character' })
    .optional(),
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
    .min(10, { message: 'phone number can`t be less than 10 character' })
    .max(14, { message: 'phone number can`t be more than 14 character' })
    .refine((value) => /^\d{10,14}$/.test(value), {
      message: 'Phone number must contain only digits (10-14 characters)',
    }),
  gender: z.enum(['male', 'female', 'others'] as [string, ...string[]]),
  dateOfBirth: z.string({
    invalid_type_error: 'date must be string',
  }),
  profileImage: z.string().optional(),
});

const updateUserInfoValidationSchema = z.object({
  name: updateUSerNameValidationSchema.optional(),
  email: z.string().email().optional(),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number can't be less than 10 characters" })
    .max(14, { message: "Phone number can't be more than 14 characters" })
    .refine((value) => /^\d{10,14}$/.test(value), {
      message: 'Phone number must contain only digits (10-14 characters)',
    })
    .optional(),
  dateOfBirth: z
    .string({
      invalid_type_error: 'date must be string',
    })
    .optional(),
  gender: z
    .enum(['male', 'female', 'others'] as [string, ...string[]])
    .optional(),
  profileImage: z.string().optional(),
  coverImage: z.string().optional(),
  homeTown: z.string().optional(),
  currentAddress: z.string().optional(),
});

const userStatusValidationSchema = z.object({
  status: z.enum(['active', 'deactive'] as [string, ...string[]]),
});

const userRoleValidationSchema = z.object({
  role: z.enum(['user', 'admin'] as [string, ...string[]]),
});

const accountDelationValidationSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'password can`t be less than 6 character' })
    .max(20, { message: 'password can`t be more than 20 character' }),
});
export const userValidation = {
  userValidationSchema,
  userStatusValidationSchema,
  userRoleValidationSchema,
  updateUserInfoValidationSchema,
  accountDelationValidationSchema,
};
