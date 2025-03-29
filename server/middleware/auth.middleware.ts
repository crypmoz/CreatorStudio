import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

/**
 * Middleware to check if user is authenticated
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized - Please login to access this resource' });
}

/**
 * Middleware to check if user has admin role
 */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Forbidden - Admin access required' });
}

/**
 * Add storage to request object
 */
export function injectStorage(req: Request, _res: Response, next: NextFunction) {
  req.storage = storage;
  next();
}

// Extend Express Request interface to include user and storage
declare global {
  namespace Express {
    interface Request {
      storage: typeof storage;
    }
  }
}