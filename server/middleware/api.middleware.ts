import { Request, Response, NextFunction } from 'express';
import { OPENAI_API_KEY, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET } from '../config/env';

/**
 * Middleware to check if required API keys are set
 * Used to validate API access before making external API calls
 */
export function requireOpenAI(req: Request, res: Response, next: NextFunction) {
  if (!OPENAI_API_KEY) {
    return res.status(503).json({
      message: 'OpenAI API is not configured',
      error: 'OPENAI_API_KEY environment variable is not set',
      code: 'API_NOT_CONFIGURED'
    });
  }
  next();
}

/**
 * Middleware to check if TikTok API keys are configured
 */
export function requireTikTok(req: Request, res: Response, next: NextFunction) {
  if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) {
    return res.status(503).json({
      message: 'TikTok API is not configured',
      error: 'TIKTOK_CLIENT_KEY or TIKTOK_CLIENT_SECRET environment variables are not set',
      code: 'API_NOT_CONFIGURED'
    });
  }
  next();
}

/**
 * Middleware to validate the existence of required external API tokens
 * Takes an array of API names to check
 */
export function validateExternalApis(apiNames: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingApis = [];
    
    for (const api of apiNames) {
      switch (api.toLowerCase()) {
        case 'openai':
          if (!OPENAI_API_KEY) missingApis.push('OpenAI');
          break;
        case 'tiktok':
          if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) missingApis.push('TikTok');
          break;
        // Add other APIs as needed
      }
    }
    
    if (missingApis.length > 0) {
      return res.status(503).json({
        message: `Required external API(s) not configured: ${missingApis.join(', ')}`,
        error: 'Missing API credentials',
        code: 'API_NOT_CONFIGURED'
      });
    }
    
    next();
  };
}