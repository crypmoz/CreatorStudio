import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if user is authenticated
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource'
    });
  }
  next();
}

/**
 * Middleware to verify user role
 */
export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource'
      });
    }
    
    if (req.user?.role !== role) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `You must have ${role} role to access this resource`
      });
    }
    
    next();
  };
}

/**
 * Middleware for handling demo users with special access
 */
export function isDemoUser(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user.username.startsWith('demo_')) {
    req.isDemoUser = true;
  } else {
    req.isDemoUser = false;
  }
  next();
}

/**
 * Restrict certain operations for demo users
 */
export function preventDemoUserOperations(req: Request, res: Response, next: NextFunction) {
  if (req.isDemoUser) {
    return res.status(403).json({
      error: 'Forbidden for demo users',
      message: 'This operation is not available for demo users'
    });
  }
  next();
}

// Add custom properties to the Express Request interface
declare global {
  namespace Express {
    interface Request {
      isDemoUser?: boolean;
    }
  }
}