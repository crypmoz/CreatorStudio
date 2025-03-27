import { createClient } from '@supabase/supabase-js';
import mongoose from 'mongoose';
import { log } from '../vite';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// MongoDB configuration
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/creatoraide';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Connect to MongoDB
export const connectToMongoDB = async (): Promise<void> => {
  if (!process.env.MONGODB_URI) {
    log('MongoDB URI not found. Using default connection string.', 'database');
  }
  
  try {
    await mongoose.connect(mongoUri);
    log('Connected to MongoDB successfully', 'database');
  } catch (error) {
    log(`MongoDB connection error: ${error}`, 'database');
    throw error;
  }
};

// Test Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      log(`Supabase connection error: ${error.message}`, 'database');
      return false;
    }
    
    log('Connected to Supabase successfully', 'database');
    return true;
  } catch (error) {
    log(`Unexpected Supabase error: ${error}`, 'database');
    return false;
  }
};

// Initialize database connections
export const initializeDatabases = async (): Promise<void> => {
  // Connect to MongoDB
  await connectToMongoDB();
  
  // Test Supabase connection (if API key is provided)
  if (supabaseUrl && supabaseKey) {
    await testSupabaseConnection();
  } else {
    log('Supabase credentials not provided. Skipping connection test.', 'database');
  }
};