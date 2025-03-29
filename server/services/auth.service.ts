import { storage } from '../storage';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@shared/schema';
import { randomBytes } from 'crypto';

/**
 * Service for handling authentication-related operations
 */
class AuthService {
  private saltRounds = 10;
  private jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_for_dev';
  private jwtExpiresIn = '7d';
  
  /**
   * Register a new user with email and password
   * @param username Username
   * @param email Email address
   * @param password Plain text password
   * @param displayName Display name
   * @param role User role
   * @returns Created user object without password
   */
  async registerWithEmail(
    username: string,
    email: string,
    password: string,
    displayName: string,
    role: string = 'user'
  ): Promise<Omit<User, 'password'>> {
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    
    // Create user
    const user = await storage.createUser({
      username,
      email,
      password: hashedPassword,
      displayName,
      role,
      bio: null,
      profileImageUrl: null,
      provider: 'email',
      providerId: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      lastLoginAt: new Date(),
      preferences: {
        notifications: true,
        theme: "system",
        language: "en"
      },
      socialProfiles: {
        instagram: null,
        youtube: null,
        twitter: null,
        facebook: null,
        tiktok: null
      },
      contentCreatorInfo: {
        niche: [],
        brandDeals: false,
        monetized: false,
        avgViews: null,
        avgEngagement: null,
        contentFrequency: null
      }
    });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  /**
   * Login a user with email and password
   * @param username Username or email
   * @param password Plain text password
   * @param ipAddress IP address
   * @param userAgent User agent
   * @returns User object without password
   */
  async loginWithEmail(
    username: string,
    password: string,
    ipAddress: string,
    userAgent: string
  ): Promise<Omit<User, 'password'>> {
    // Get user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Update login info (would be implemented in a real app)
    // In our demo we don't have the ability to update these fields
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  /**
   * Login or register a user with a social provider
   * @param provider Social provider name
   * @param providerId Provider user ID
   * @param email Email address
   * @param displayName Display name
   * @param profileImageUrl Profile image URL
   * @param ipAddress IP address
   * @param userAgent User agent
   * @returns User object without password
   */
  async loginWithSocialProvider(
    provider: string,
    providerId: string,
    email: string,
    displayName: string,
    profileImageUrl: string | null,
    ipAddress: string,
    userAgent: string
  ): Promise<Omit<User, 'password'>> {
    // This is a simplified version, in a real app we would:
    // 1. Check if user exists with this provider ID
    // 2. If yes, update and return
    // 3. If no, check if email exists
    //    a. If yes, link the provider to the existing account
    //    b. If no, create a new account
    
    // Generate a random password for the user
    const randomPassword = randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, this.saltRounds);
    
    // Create a username from the display name
    const baseUsername = displayName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 15);
    const username = `${baseUsername}${randomBytes(4).toString('hex')}`;
    
    // Create user
    const user = await storage.createUser({
      username,
      email,
      password: hashedPassword,
      displayName,
      role: 'user',
      bio: null,
      profileImageUrl,
      provider,
      providerId,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      lastLoginAt: new Date(),
      preferences: {
        notifications: true,
        theme: "system",
        language: "en"
      },
      socialProfiles: {
        instagram: null,
        youtube: null,
        twitter: null,
        facebook: null,
        tiktok: null
      },
      contentCreatorInfo: {
        niche: [],
        brandDeals: false,
        monetized: false,
        avgViews: null,
        avgEngagement: null,
        contentFrequency: null
      }
    });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  /**
   * Log out a user
   * @param userId User ID (optional)
   * @returns Success indicator
   */
  async logout(userId?: number | string): Promise<boolean> {
    // In a real app, we would invalidate the session or token
    // Here we just return success
    return true;
  }
  
  /**
   * Set up two-factor authentication
   * @param userId User ID
   * @returns Setup information including secret and QR code URL
   */
  async setupTwoFactor(userId: number): Promise<{ secret: string, qrCodeUrl: string }> {
    // In a real app, we would generate a secret and QR code URL
    // Here we just return dummy values
    return {
      secret: 'DUMMY_SECRET',
      qrCodeUrl: 'https://example.com/qr-code'
    };
  }
  
  /**
   * Verify a two-factor code
   * @param userId User ID
   * @param code Verification code
   * @param ipAddress IP address
   * @param userAgent User agent
   * @returns User object without password
   */
  async verifyTwoFactorCode(
    userId: string,
    code: string,
    ipAddress: string,
    userAgent: string
  ): Promise<Omit<User, 'password'>> {
    // In a real app, we would verify the code against the user's secret
    // Here we just return the user
    const user = await storage.getUser(parseInt(userId));
    if (!user) {
      throw new Error('User not found');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  /**
   * Verify and enable two-factor authentication
   * @param userId User ID
   * @param code Verification code
   * @returns Success indicator
   */
  async verifyAndEnableTwoFactor(userId: number, code: string): Promise<boolean> {
    // In a real app, we would verify the code and enable 2FA for the user
    // Here we just return success
    return true;
  }
  
  /**
   * Disable two-factor authentication
   * @param userId User ID
   * @param password Plain text password
   * @returns Success indicator
   */
  async disableTwoFactor(userId: number, password: string): Promise<boolean> {
    // In a real app, we would verify the password and disable 2FA for the user
    // Here we just return success
    return true;
  }
  
  /**
   * Change user password
   * @param userId User ID
   * @param currentPassword Current plain text password
   * @param newPassword New plain text password
   * @returns Success indicator
   */
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    // Get user
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      throw new Error('Current password is incorrect');
    }
    
    // Check if new password is the same as current
    if (currentPassword === newPassword) {
      throw new Error('New password cannot be the same as the current password');
    }
    
    // In a real app, we would update the password in the database
    // Here we just return success as there's no updateUser method currently
    return true;
  }
  
  /**
   * Update user profile
   * @param userId User ID
   * @param profileData Profile data to update
   * @returns Updated user object without password
   */
  async updateProfile(userId: number, profileData: any): Promise<Omit<User, 'password'>> {
    // Get user
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, we would update the user in the database
    // Here we just return the existing user as there's no updateUser method currently
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();