import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Custom error class for application-specific errors
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Maintains proper stack trace (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Centralized error handling middleware
export const errorHandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.issues.map(e => ({ path: e.path.join('.'), message: e.message })),
    });
  }

  // Log the error for debugging purposes
  console.error('UNHANDLED ERROR:', err);

  // Generic server error
  return res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred on the server.',
  });
};