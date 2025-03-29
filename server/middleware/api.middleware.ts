import { Request, Response, NextFunction } from 'express';
import { TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, OPENAI_API_KEY, DEEPSEEK_API_KEY } from '../config/env';

/**
 * Middleware to check if required API keys are set
 * Used to validate API access before making external API calls
 */
export function requireOpenAI(req: Request, res: Response, next: NextFunction) {
  if (!OPENAI_API_KEY) {
    return res.status(503).json({
      error: 'OpenAI API not configured',
      message: 'Please set the OPENAI_API_KEY environment variable'
    });
  }
  next();
}

/**
 * Middleware to check if DeepSeek API key is configured
 */
export function requireDeepSeek(req: Request, res: Response, next: NextFunction) {
  if (!DEEPSEEK_API_KEY) {
    return res.status(503).json({
      error: 'DeepSeek API not configured',
      message: 'Please set the DEEPSEEK_API_KEY environment variable'
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
      error: 'TikTok API not configured',
      message: 'Please set the TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET environment variables'
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
    const missingApis: string[] = [];
    
    if (apiNames.includes('openai') && !OPENAI_API_KEY) {
      missingApis.push('OpenAI');
    }
    
    if (apiNames.includes('deepseek') && !DEEPSEEK_API_KEY) {
      missingApis.push('DeepSeek');
    }
    
    if (apiNames.includes('tiktok') && (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET)) {
      missingApis.push('TikTok');
    }
    
    // If we require both OpenAI and DeepSeek but at least one is available, we're good
    if (apiNames.includes('openai') && apiNames.includes('deepseek') && 
        (OPENAI_API_KEY || DEEPSEEK_API_KEY)) {
      // Remove both from missing APIs since we have at least one
      const openaiIndex = missingApis.indexOf('OpenAI');
      const deepseekIndex = missingApis.indexOf('DeepSeek');
      
      if (openaiIndex > -1) missingApis.splice(openaiIndex, 1);
      if (deepseekIndex > -1) missingApis.splice(deepseekIndex, 1);
    }
    
    if (missingApis.length > 0) {
      return res.status(503).json({
        error: 'Required API(s) not configured',
        missingApis,
        message: `Please set the environment variables for: ${missingApis.join(', ')}`
      });
    }
    
    next();
  };
}