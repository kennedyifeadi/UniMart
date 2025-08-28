import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  role: 'customer' | 'vendor' | 'admin';
  email: string;
  passwordHash: string;
  phone?: string;
  eduEmail?: string;
  eduEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  refreshTokens: string[];
}
