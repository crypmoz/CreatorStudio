import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * Authentication middleware
 * Ensures the user is authenticated before allowing access to protected routes
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

/**
 * Role-based authorization middleware
 * Ensures the authenticated user has the required role
 * @param {string[]} roles Array of allowed roles
 */
export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}

/**
 * Rate limiting middleware factory
 * Creates a rate limiter middleware with specified configuration
 * @param {number} max Maximum number of requests in the time window
 * @param {number} windowMs Time window in milliseconds
 * @param {string} message Optional custom error message
 * @returns Rate limiter middleware
 */
export function rateLimiter(max: number, windowMs: number, message?: string) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: message || 'Too many requests, please try again later',
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: message || 'Too many requests, please try again later'
      });
    }
  });
}