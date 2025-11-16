/// <reference path="../types/express.d.ts" />

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Role } from '../interfaces/Role';
import { AppError } from './error.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

interface JwtPayload {
  id: string;
  role: Role;
}

/**
 * Middleware to protect routes that require authentication.
 * Verifies the JWT from the Authorization header.
 */
export const isAuthenticated = asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      
      // Attach user id and role to the request object
      req.user = { id: decoded.id, role: decoded.role };
      
      next();
    } catch (error) {
      throw new AppError('Not authorized, token failed', 401);
    }
  }

  if (!token) {
    throw new AppError('Not authorized, no token', 401);
  }
});

/**
 * Creates a middleware to check for a specific role.
 * This should be used *after* the isAuthenticated middleware.
 * @param requiredRole The role required to access the route.
 */
export const hasRole = (requiredRole: Role) => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (req.user && req.user.role === requiredRole) {
      return next();
    }
    throw new AppError(`Forbidden: You must have the ${requiredRole} role to access this resource`, 403);
  };
};

/**
 * Creates a middleware to check for multiple roles.
 * This should be used *after* the isAuthenticated middleware.
 * @param requiredRoles The roles required to access the route.
 */
export const hasRoles = (requiredRoles: Role[]) => {
    return (req: Request, _: Response, next: NextFunction) => {
        if (req.user && requiredRoles.includes(req.user.role)) {
            return next();
        }
        throw new AppError(`Forbidden: You must be one of ${requiredRoles.join(', ')} to access this resource`, 403);
    };
};


// Specific role guards
export const isCustomer = hasRole(Role.CUSTOMER);
export const isVendor = hasRole(Role.VENDOR);
export const isAdmin = hasRole(Role.ADMIN);
