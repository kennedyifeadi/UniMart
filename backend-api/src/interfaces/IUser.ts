import { Document } from 'mongoose';
import { Role } from './Role';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  googleId?: string;
  role: Role;
  securityQuestion: string;
  securityAnswerHash: string;
  phone?: string;
  eduEmail?: string;
  eduEmailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
