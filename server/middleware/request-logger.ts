import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware to log HTTP requests
 * This logs requests and adds response time measurement
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Skip logging for static files in production to reduce noise
  if (req.path.startsWith('/assets') || req.path.startsWith('/static')) {
    return next();
  }

  // Record request start time
  const start = Date.now();
  
  // Log request
  logger.debug(`${req.method} ${req.path} - Start`, {
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined
  });

  // Track response
  res.on('finish', () => {
    // Calculate response time
    const responseTime = Date.now() - start;
    
    // Log request completion with response time
    logger.httpRequest(req, res, responseTime);
  });

  next();
};