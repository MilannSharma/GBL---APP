import { z } from 'zod';

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Invalid phone number format')
    .regex(/^\+?[0-9]+$/, 'Phone number must contain only digits'),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^[0-9]+$/, 'OTP must contain only digits'),
});

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Please enter your mobile number, username, or email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type PhoneFormValues = z.infer<typeof phoneSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
