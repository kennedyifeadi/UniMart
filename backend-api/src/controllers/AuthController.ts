import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import AuthService from '../services/AuthService';
import {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifySecurityQuestionSchema,
} from '../utils/validationSchemas';
import { Role } from '../interfaces/Role';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export const securityQuestions = [
  "What is your student registration number?",
  "What was the name of your favorite lecturer in your first year?",
  "In which city is your university located?",
  "What is the name of your favorite course?",
  "Who is your favorite lecturer?",
  "What was the name of your university's main library?",
];

class AuthController {
  public register = asyncHandler(async (req: Request, res: Response) => {
    const userData = registerSchema.parse(req.body);
    const user = await AuthService.register(userData);
    const userResponse = { ...user };
    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    const loginData = loginSchema.parse(req.body);
    const { accessToken, refreshToken, user } = await AuthService.login(loginData);

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userResponse = { ...user };
    res.json({ message: 'Login successful', accessToken, user: userResponse });
  });

  public sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const otpData = sendOtpSchema.parse(req.body);
    await AuthService.sendOtp(otpData);
    res.status(200).json({ message: 'OTP sent successfully' });
  });

  public verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const otpData = verifyOtpSchema.parse(req.body);
    const { accessToken, refreshToken, user } = await AuthService.verifyOtp(otpData);

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    const userResponse = { ...user };
    res.json({ message: 'OTP verification successful', accessToken, user: userResponse });
  });

  public forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const emailData = forgotPasswordSchema.parse(req.body);
    await AuthService.forgotPassword(emailData);
    res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
  });

  public resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const resetData = resetPasswordSchema.parse(req.body);
    await AuthService.resetPassword(resetData);
    res.status(200).json({ message: 'Password has been reset successfully.' });
  });

  public verifySecurityQuestion = asyncHandler(async (req: Request, res: Response, _: NextFunction) => {
    const verificationData = verifySecurityQuestionSchema.parse(req.body);
    const isValid = await AuthService.verifySecurityQuestion(verificationData);
    if (!isValid) {
        res.status(401).json({ message: 'Security answer is incorrect.' });
        return;
    }
    res.status(200).json({ message: 'Security answer verified successfully.' });
  });

  public refreshToken = asyncHandler(async (req: Request, res: Response, _: NextFunction) => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token not found' });
      return;
    }
    const accessToken = await AuthService.refreshToken(refreshToken);
    res.json({ accessToken });
  });

  public logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (userId) {
      await AuthService.logout(userId);
    }
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    res.status(200).json({ message: 'Logged out successfully' });
  });

  public googleLogin = asyncHandler(async (_: Request, res: Response) => {
    res.status(501).json({ message: 'Not implemented' });
  });

  public googleCallback = asyncHandler(async (_: Request, res: Response) => {
    res.status(501).json({ message: 'Not implemented' });
  });

  public getSecurityQuestions = asyncHandler(async (_: Request, res: Response) => {
    res.status(200).json(securityQuestions);
  });
}

export default new AuthController();