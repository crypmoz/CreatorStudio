import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import { User } from '@shared/schema';

// In a real application, these values should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';

// Augment the Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: string;
    }
  }
}

// Define a type for request counters used in rate limiting
type RequestCounters = {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
};

/**
 * Authentication middleware that verifies JWT token
 * and attaches user to request object
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Extract user ID from decoded token
      const userId = typeof decoded === 'object' && decoded !== null && 'sub' in decoded
        ? Number(decoded.sub)
        : null;
        
      if (!userId) {
        return res.status(401).json({ error: 'Invalid token format' });
      }
      
      // Get user from database
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      // Attach user and token to request
      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication middleware that attaches user to request
 * if token is valid, but doesn't fail if no token is provided
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Extract user ID from decoded token
      const userId = typeof decoded === 'object' && decoded !== null && 'sub' in decoded
        ? Number(decoded.sub)
        : null;
        
      if (userId) {
        // Get user from database
        const user = await storage.getUser(userId);
        if (user) {
          // Attach user and token to request
          req.user = user;
          req.token = token;
        }
      }
    } catch (error) {
      // Continue without user
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

/**
 * Middleware to check if 2FA is required for the action
 */
export const requireComplete2FA = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.twoFactorEnabled && req.token === 'requires_2fa') {
    return res.status(403).json({ error: 'Two factor authentication required' });
  }
  
  next();
};

// Store request counts for rate limiting
const requestCounters: RequestCounters = {};

/**
 * Rate limiting middleware for security
 */
export const rateLimiter = (maxRequests: number, timeWindow: number) => {
  // Clean up expired entries every hour
  setInterval(() => {
    const now = Date.now();
    for (const ip in requestCounters) {
      if (requestCounters[ip].resetTime < now) {
        delete requestCounters[ip];
      }
    }
  }, 3600000);
  
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || '0.0.0.0';
    const now = Date.now();
    
    // Initialize counter for this IP if it doesn't exist
    if (!requestCounters[ip]) {
      requestCounters[ip] = {
        count: 0,
        resetTime: now + timeWindow,
      };
    }
    
    // Reset counter if time window has passed
    if (requestCounters[ip].resetTime < now) {
      requestCounters[ip] = {
        count: 0,
        resetTime: now + timeWindow,
      };
    }
    
    // Increment counter
    requestCounters[ip].count++;
    
    // Check if limit exceeded
    if (requestCounters[ip].count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests, please try again later',
        retryAfter: Math.ceil((requestCounters[ip].resetTime - now) / 1000),
      });
    }
    
    next();
  };
};