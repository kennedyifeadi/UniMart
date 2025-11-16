import AuthService from '../services/AuthService';
import UserModel, { User } from '../models/User.model';
import redisClient from '../config/redis';
import { Role } from '../interfaces/Role';
import { AppError } from '../middlewares/error.middleware';
import jwt from 'jsonwebtoken';

// Mock the dependencies
jest.mock('../models/User.model');
jest.mock('../config/redis');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('AuthService - Login Flow', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully log in a user with correct credentials and return tokens', async () => {
    // Arrange
    const mockUser = {
      _id: 'someUserId',
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
      role: Role.CUSTOMER,
      comparePassword: jest.fn().mockResolvedValue(true),
      toObject: jest.fn().mockReturnValue({
        _id: 'someUserId',
        email: 'test@example.com',
        role: Role.CUSTOMER,
      }),
    };
    
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (jwt.sign as jest.Mock)
      .mockReturnValueOnce('mockAccessToken')
      .mockReturnValueOnce('mockRefreshToken');

    // Act
    const result = await AuthService.login({
      email: 'test@example.com',
      password: 'password123',
    }) as { accessToken: string; refreshToken: string; user: User };

    // Assert
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(redisClient.set).toHaveBeenCalledWith(
      `refreshToken:${mockUser._id}`,
      'mockRefreshToken',
      'EX',
      expect.any(Number)
    );
    expect(result.accessToken).toBe('mockAccessToken');
    expect(result.refreshToken).toBe('mockRefreshToken');
    expect(result.user).toBe(mockUser);
  });

  it('should throw an AppError if the user is not found', async () => {
    // Arrange
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    // Act & Assert
    await expect(
      AuthService.login({
        email: 'nonexistent@example.com',
        password: 'password123',
      })
    ).rejects.toThrow(new AppError('Invalid email or password', 401));
  });

  it('should throw an AppError if the password is incorrect', async () => {
    // Arrange
    const mockUser = {
      _id: 'someUserId',
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
      role: Role.CUSTOMER,
      comparePassword: jest.fn().mockResolvedValue(false),
    };
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    // Act & Assert
    await expect(
      AuthService.login({
        email: 'test@example.com',
        password: 'wrongPassword',
      })
    ).rejects.toThrow(new AppError('Invalid email or password', 401));
  });
});
