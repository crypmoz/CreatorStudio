// Common environment variables
export const PORT = parseInt(process.env.PORT || '3000', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// Auth and security
export const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'session-secret-change-in-production';

// Database connections
export const DB_URI = process.env.DB_URI || '';
export const MONGODB_URI = process.env.MONGODB_URI || '';
export const SUPABASE_URL = process.env.SUPABASE_URL || '';
export const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

// API keys and external services
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
export const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || '';
export const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || '';

// Export all environment variables as a single object for convenience
export const config = {
  port: PORT,
  env: NODE_ENV,
  isProduction: IS_PRODUCTION,
  jwt: {
    secret: JWT_SECRET,
    expiresIn: JWT_EXPIRES_IN
  },
  session: {
    secret: SESSION_SECRET
  },
  db: {
    uri: DB_URI,
    mongodbUri: MONGODB_URI,
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_KEY
  },
  api: {
    openai: OPENAI_API_KEY,
    deepseek: DEEPSEEK_API_KEY,
    tiktok: {
      clientKey: TIKTOK_CLIENT_KEY,
      clientSecret: TIKTOK_CLIENT_SECRET
    }
  }
};

export default config;