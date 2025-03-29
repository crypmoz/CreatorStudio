import { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { CORS_ORIGIN, IS_PRODUCTION } from '../config/env';

/**
 * Setup security middleware for the Express application
 */
export function setupSecurity(app: Express): void {
  // Secure HTTP headers with helmet
  app.use(helmet({
    contentSecurityPolicy: IS_PRODUCTION ? undefined : false, // Enable in production
    crossOriginEmbedderPolicy: IS_PRODUCTION ? undefined : false, // Enable in production
  }));
  
  // Configure CORS
  app.use(cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));
  
  // Rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later',
  });
  
  // Apply rate limiting to API routes
  app.use('/api', apiLimiter);
  
  // Custom security headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    next();
  });
}

// Additional security middleware for specific routes
export function requireSecure(req: Request, res: Response, next: NextFunction): void {
  // Check if request is secure (HTTPS)
  if (IS_PRODUCTION && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

// CSRF Protection (would need to add csrf library)
export function setupCSRF(app: Express): void {
  if (IS_PRODUCTION) {
    // Implement CSRF protection in production
    // This would typically use a library like 'csurf'
    console.log('CSRF protection should be implemented for production');
  }
}