/**
 * Environment Configuration
 * This file centralizes all environment variables and provides defaults
 * for local development.
 */

// Server configuration
export const PORT = parseInt(process.env.PORT || '3000', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// Security
export const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'session-secret-change-in-production';

// CORS settings
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Database configuration
export const DB_URI = process.env.DB_URI || '';
export const MONGODB_URI = process.env.MONGODB_URI || '';
export const SUPABASE_URL = process.env.SUPABASE_URL || '';
export const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

// External APIs
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
export const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || '';
export const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || '';

// Feature flags
export const ENABLE_DEEPSEEK = process.env.ENABLE_DEEPSEEK === 'true';
export const ENABLE_TIKTOK_DIRECT_POSTING = process.env.ENABLE_TIKTOK_DIRECT_POSTING === 'true';
export const ENABLE_ANALYTICS = process.env.ENABLE_ANALYTICS === 'true';

// Export all config in one object for convenience
export const config = {
  port: PORT,
  nodeEnv: NODE_ENV,
  isProduction: IS_PRODUCTION,
  jwtSecret: JWT_SECRET,
  jwtExpiresIn: JWT_EXPIRES_IN,
  sessionSecret: SESSION_SECRET,
  corsOrigin: CORS_ORIGIN,
  dbUri: DB_URI,
  mongodbUri: MONGODB_URI,
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_KEY,
  openaiApiKey: OPENAI_API_KEY,
  deepseekApiKey: DEEPSEEK_API_KEY,
  tiktokClientKey: TIKTOK_CLIENT_KEY,
  tiktokClientSecret: TIKTOK_CLIENT_SECRET,
  enableDeepseek: ENABLE_DEEPSEEK,
  enableTiktokDirectPosting: ENABLE_TIKTOK_DIRECT_POSTING,
  enableAnalytics: ENABLE_ANALYTICS,
};