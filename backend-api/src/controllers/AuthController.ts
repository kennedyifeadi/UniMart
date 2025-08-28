import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

const authService = AuthService;

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required.' });
      }
      const { accessToken, refreshToken } = await authService.signup({ email, passwordHash: password, role });
      res.status(201).json({ accessToken, refreshToken });
    } catch (err: any) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
      const tokens = await authService.login(email, password);
      if (!tokens) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.status(200).json(tokens);
    } catch (err: any) {
      next(err);
    }
  }
}
