import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  _id: string;
  role: 'customer' | 'vendor' | 'admin';
  email: string;
  passwordHash: string;
  phone?: string;
  eduEmail?: string;
  eduEmailVerified: boolean;
  refreshToken?: string;
}

const userSchema = new Schema<IUser>(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    role: {
      type: String,
      enum: ['customer', 'vendor', 'admin'],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    eduEmail: {
      type: String,
    },
    eduEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>('User', userSchema);
