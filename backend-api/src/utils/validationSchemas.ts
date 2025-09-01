import { z } from 'zod';
import { Role } from '../interfaces/Role';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role),
  securityQuestion: z.string().min(10),
  securityAnswer: z.string().min(3),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const sendOtpSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export const verifySecurityQuestionSchema = z.object({
  email: z.string().email(),
  securityAnswer: z.string(),
});
