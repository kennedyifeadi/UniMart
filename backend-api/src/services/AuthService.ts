import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository';
import { IUser } from '../models/User';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'changemerefresh';

// In-memory refresh token store for demo (replace with DB in production)
const refreshTokens: Record<string, string> = {};

class AuthService {

  async signup(userData: Partial<IUser>): Promise<{ accessToken: string; refreshToken: string }> {
    if (!userData.passwordHash) {
      throw new Error('Password is required');
    }
    const salt = await bcrypt.genSalt(10);
    userData.passwordHash = await bcrypt.hash(userData.passwordHash, salt);
  const user = await UserRepository.createUser(userData);

    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    refreshTokens[user._id] = refreshToken;
  await UserRepository.updateUser(user._id, { refreshToken });

    return { accessToken, refreshToken };
  }

  async login(email: string, pass: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  const user = await UserRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      return null;
    }

    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    refreshTokens[user._id] = refreshToken;
  await UserRepository.updateUser(user._id, { refreshToken });

    return { accessToken, refreshToken };
  }

  private generateAccessToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  // For demo: validate refresh token (should check DB in production)
  validateRefreshToken(userId: string, token: string): boolean {
    return refreshTokens[userId] === token;
  }
}

export default new AuthService();
