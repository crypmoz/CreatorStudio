import { Express } from 'express';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { storage } from './storage';
import { User } from '@shared/schema';
import bcrypt from 'bcrypt';

// Extend Express.User interface
declare global {
  namespace Express {
    // Use type augmentation
    interface User {
      id: number;
      username: string;
      email: string;
      displayName: string;
      role: string;
      twoFactorEnabled: boolean;
      provider: string;
      providerId?: string;
    }
  }
}

const MemStore = createMemoryStore(session);

export function setupAuth(app: Express) {
  // Session configuration
  const sessionSecret = process.env.SESSION_SECRET || 'your-secret-key-change-in-production';
  
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
      store: new MemStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );
  
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Local strategy for email/password login
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Find user by username or email
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        // For demo purposes, allow direct password comparison
        // In production, always use bcrypt.compare
        if (user.password === password) {
          return done(null, user);
        }
        
        return done(null, false, { message: 'Invalid credentials' });
      } catch (error) {
        return done(error);
      }
    })
  );
  
  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}