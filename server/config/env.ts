// Environment configuration for the application

// Server settings
export const PORT = parseInt(process.env.PORT || '5000', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// JWT authentication settings
export const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'session-secret-change-in-production';

// Database connection settings
export const DB_URI = process.env.DB_URI || '';
export const MONGODB_URI = process.env.MONGODB_URI || '';
export const SUPABASE_URL = process.env.SUPABASE_URL || '';
export const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

// API keys
export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-f71d125cbd784d82a964d8f7d6832e67';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || '';
export const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || '';

// Consolidated config object for easy export
export const config = {
  server: {
    port: PORT,
    nodeEnv: NODE_ENV,
    isProduction: IS_PRODUCTION,
  },
  auth: {
    jwtSecret: JWT_SECRET,
    jwtExpiresIn: JWT_EXPIRES_IN,
    sessionSecret: SESSION_SECRET,
  },
  database: {
    dbUri: DB_URI,
    mongodbUri: MONGODB_URI,
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_KEY,
  },
  api: {
    deepseek: {
      key: DEEPSEEK_API_KEY,
      baseUrl: 'https://api.deepseek.com',
    },
    openai: {
      key: OPENAI_API_KEY,
      baseUrl: 'https://api.openai.com',
    },
    tiktok: {
      clientKey: TIKTOK_CLIENT_KEY,
      clientSecret: TIKTOK_CLIENT_SECRET,
    }
  }
};