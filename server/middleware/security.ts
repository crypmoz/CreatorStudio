import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { CORS_ORIGIN, IS_PRODUCTION } from '../config/env';

// Initialize the rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { 
    status: 429, 
    message: 'Too many requests, please try again later.' 
  },
  skip: (req: Request) => !IS_PRODUCTION, // Skip rate limiting in development
});

// More restrictive rate limiter for auth-related endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    status: 429, 
    message: 'Too many login attempts, please try again later.' 
  },
  skip: (req: Request) => !IS_PRODUCTION, // Skip rate limiting in development
});

// CSRF Protection
const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Only check for POST/PUT/DELETE/PATCH requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const origin = req.get('origin');
    
    // If no origin (like curl/postman) or doesn't match allowed origins
    if (!origin || (CORS_ORIGIN !== '*' && !CORS_ORIGIN.includes(origin))) {
      return res.status(403).json({
        status: 403,
        message: 'CSRF check failed'
      });
    }
  }
  next();
};

// Set security headers
export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for now
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.tiktok.com', 'https://api.deepseek.com', 'https://api.openai.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding
    referrerPolicy: { policy: 'same-origin' }
  }),
  apiLimiter,
  csrfProtection, // Custom CSRF check
];

// Routes that need special rate limiting
export const authRateLimiter = authLimiter;

// Export the headers check middleware separately
export const validateContentType = (req: Request, res: Response, next: NextFunction) => {
  // Skip for GET/HEAD/OPTIONS or if no body is sent
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method) || !req.body || Object.keys(req.body).length === 0) {
    return next();
  }
  
  // Ensure proper content type for requests with body
  const contentType = req.get('Content-Type');
  if (!contentType || !contentType.includes('application/json')) {
    return res.status(415).json({
      status: 415,
      message: 'Unsupported Media Type. API only accepts application/json'
    });
  }
  
  next();
};

// Sanitize request data
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    // Basic sanitization - convert strings to prevent XSS
    const sanitize = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }
      
      const result: any = Array.isArray(obj) ? [] : {};
      
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          // Basic sanitization example
          result[key] = value
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        } else if (typeof value === 'object' && value !== null) {
          result[key] = sanitize(value);
        } else {
          result[key] = value;
        }
      }
      
      return result;
    };
    
    req.body = sanitize(req.body);
  }
  
  next();
};