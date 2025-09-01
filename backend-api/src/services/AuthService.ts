import UserModel, { User } from '../models/User.model';
import { Role } from '../interfaces/Role';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis';
import otpGenerator from 'otp-generator';
import { z } from 'zod';
import {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifySecurityQuestionSchema,
} from '../utils/validationSchemas';
import { sendEmail } from '../utils/email';
import { AppError } from '../middlewares/error.middleware';

// --- Configuration ---
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-default-refresh-secret';
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || 'your-default-reset-secret';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

class AuthService {
  // --- User Registration ---
  public async register(data: z.infer<typeof registerSchema>): Promise<User> {
    const { email, password, role, securityQuestion, securityAnswer } = data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const user = new UserModel({
      email,
      passwordHash: password,
      role,
      securityQuestion,
      securityAnswerHash: securityAnswer,
    });

    await user.save();
    return user;
  }

  // --- Email/Password Login ---
  public async login(data: z.infer<typeof loginSchema>): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const { email, password } = data;
    const user = await UserModel.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const { accessToken, refreshToken } = this.generateAndStoreTokens(user);
    return { accessToken, refreshToken, user };
  }

  // --- OTP Flow (Customers Only) ---
  public async sendOtp(data: z.infer<typeof sendOtpSchema>): Promise<void> {
    const { email } = data;

    const rateLimitKey = `otp-rate-limit:${email}`;
    const attempts = await redisClient.get(rateLimitKey);
    if (attempts && parseInt(attempts, 10) >= 5) {
      throw new AppError('Too many OTP requests. Please try again later.', 429);
    }

    const user = await UserModel.findOne({ email });
    if (!user || user.role !== Role.CUSTOMER) {
      throw new AppError('OTP can only be sent to registered customers', 404);
    }

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    await redisClient.set(`otp:${email}`, otp, 'EX', 60 * 5);
    const pipeline = redisClient.pipeline();
    pipeline.incr(rateLimitKey);
    pipeline.expire(rateLimitKey, 3600);
    await pipeline.exec();

    await sendEmail(email, 'Your OTP Code', `Your OTP code is: ${otp}`);
  }

  public async verifyOtp(data: z.infer<typeof verifyOtpSchema>): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const { email, otp } = data;
    const storedOtp = await redisClient.get(`otp:${email}`);

    if (storedOtp !== otp) {
      throw new AppError('Invalid or expired OTP', 400);
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await redisClient.del(`otp:${email}`);
    const { accessToken, refreshToken } = this.generateAndStoreTokens(user);
    return { accessToken, refreshToken, user };
  }

  // --- Password Reset Flow ---
  public async forgotPassword(data: z.infer<typeof forgotPasswordSchema>): Promise<void> {
    const { email } = data;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_RESET_SECRET, { expiresIn: '10m' });
    const resetLink = `http://localhost:3000/reset-password?token=${token}`; // Assuming a frontend route
    await sendEmail(email, 'Password Reset', `Click here to reset your password: ${resetLink}`);
  }

  public async resetPassword(data: z.infer<typeof resetPasswordSchema>): Promise<void> {
    const { token, newPassword } = data;
    let userId;
    try {
      const decoded = jwt.verify(token, JWT_RESET_SECRET) as { id: string };
      userId = decoded.id;
    } catch (error) {
      throw new AppError('Invalid or expired password reset token', 400);
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.passwordHash = newPassword;
    await user.save();
  }

  // --- Security Question Verification ---
  public async verifySecurityQuestion(data: z.infer<typeof verifySecurityQuestionSchema>): Promise<boolean> {
    const { email, securityAnswer } = data;

    const rateLimitKey = `security-question-rate-limit:${email}`;
    const attempts = await redisClient.get(rateLimitKey);
    if (attempts && parseInt(attempts, 10) >= 5) {
      throw new AppError('Too many verification attempts. Please try again later.', 429);
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isCorrect = await user.compareSecurityAnswer(securityAnswer);

    if (!isCorrect) {
      const pipeline = redisClient.pipeline();
      pipeline.incr(rateLimitKey);
      pipeline.expire(rateLimitKey, 3600); // 1 hour expiry
      await pipeline.exec();
      return false;
    }

    await redisClient.del(rateLimitKey);
    return true;
  }

  // --- Token Management ---
  public async refreshToken(token: string): Promise<string> {
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }

    const storedToken = await redisClient.get(`refreshToken:${decoded.id}`);
    if (storedToken !== token) {
      throw new AppError('Refresh token has been revoked or is invalid', 401);
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.generateAccessToken(user);
  }

  public async logout(userId: string): Promise<void> {
    await redisClient.del(`refreshToken:${userId}`);
  }

  // --- Google OAuth (Placeholder) ---
  public async handleGoogleLogin(googleProfile: any): Promise<{ accessToken: string; refreshToken:string; user: User }> {
    const { email, sub: googleId } = googleProfile;
    
    let user = await UserModel.findOne({ googleId });

    if (!user) {
      user = await UserModel.findOne({ email });
      if (user) {
        user.googleId = googleId;
      } else {
        user = new UserModel({
          email,
          googleId,
          role: Role.CUSTOMER,
          passwordHash: 'not-set',
          securityQuestion: 'not-set',
          securityAnswerHash: 'not-set',
        });
      }
      await user.save();
    }
    
    const { accessToken, refreshToken } = this.generateAndStoreTokens(user);
    return { accessToken, refreshToken, user };
  }


  // --- Token Helper Methods ---
  private generateAccessToken(user: User): string {
    return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  }

  private generateRefreshToken(user: User): string {
    return jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  }

  private generateAndStoreTokens(user: User): { accessToken: string; refreshToken: string } {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    redisClient.set(`refreshToken:${user._id.toString()}`, refreshToken, 'EX', 60 * 60 * 24 * 7);
    return { accessToken, refreshToken };
  }
}

export default new AuthService();
