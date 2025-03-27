import { storage } from '../storage';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { User } from '@shared/schema';

// In a real application, these values should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';
const JWT_EXPIRY = '24h';

/**
 * Class handling all authentication-related services
 */
class AuthService {
  /**
   * Register a new user with email and password
   */
  async registerWithEmail(
    username: string,
    email: string,
    password: string,
    displayName: string,
    role: 'user' | 'creator' | 'admin'
  ): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await storage.createUser({
      username,
      email,
      password: hashedPassword,
      displayName,
      role,
      provider: 'email',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Generate JWT token
    const token = this.generateToken(user);

    // Return user (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Login a user with email and password
   */
  async loginWithEmail(
    username: string,
    password: string,
    ipAddress: string,
    userAgent: string
  ): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // Find user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Compare passwords with bcrypt
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new Error('Invalid credentials');
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Create a copy without the password
      const { password: _, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token: 'requires_2fa',
      };
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Return user (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Verify a 2FA code during login
   */
  async verifyTwoFactorCode(
    userId: string,
    code: string,
    ipAddress: string,
    userAgent: string
  ): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // Find user
    const user = await storage.getUser(parseInt(userId));
    if (!user) {
      throw new Error('User not found');
    }

    // In a real application, verify code against user's 2FA secret
    // For demo purposes, we'll just check if the code is '123456'
    if (code !== '123456') {
      throw new Error('Invalid verification code');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Return user (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Set up 2FA for a user
   */
  async setupTwoFactor(userId: number): Promise<{ otpAuthUrl: string, qrCode: string }> {
    // Find user
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate secret
    const secret = authenticator.generateSecret();

    // Generate OTP Auth URL
    const appName = 'CreatorAIDE';
    const accountName = user.email;
    const otpAuthUrl = authenticator.keyuri(accountName, appName, secret);

    // Generate QR code
    const qrCode = await qrcode.toDataURL(otpAuthUrl);

    // In a real application, save the secret temporarily until verification
    // For now, we'll just return the auth URL and QR code
    return {
      otpAuthUrl,
      qrCode,
    };
  }

  /**
   * Verify and enable 2FA after setup
   */
  async verifyAndEnableTwoFactor(userId: number, code: string): Promise<boolean> {
    // Find user
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real application, verify code against user's temporary secret
    // For demo purposes, we'll just check if the code is '123456'
    if (code !== '123456') {
      throw new Error('Invalid verification code');
    }

    // In a real application, save the verified secret and enable 2FA
    // For now, we'll just return true
    return true;
  }

  /**
   * Disable 2FA for a user
   */
  async disableTwoFactor(userId: number, password: string): Promise<boolean> {
    // Find user
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password with bcrypt
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new Error('Invalid password');
    }

    // In a real application, disable 2FA for the user
    // For now, we'll just return true
    return true;
  }

  /**
   * Login or register with a social provider
   */
  async loginWithSocialProvider(
    provider: 'google' | 'twitter' | 'tiktok',
    providerId: string,
    email: string,
    displayName: string,
    profileImageUrl: string | null,
    ipAddress: string,
    userAgent: string
  ): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // Find user by provider and providerId
    let user = await this.findUserByProvider(provider, providerId);

    // If user doesn't exist, create a new one
    if (!user) {
      // Generate a random password and hash it
      const randomPassword = 'social_login_' + Math.random().toString(36).substring(2);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = await storage.createUser({
        username: email.split('@')[0] + Date.now(), // Generate a unique username
        email,
        password: hashedPassword,
        displayName,
        profileImageUrl: profileImageUrl || undefined,
        provider,
        providerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Return user (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Log out a user
   */
  async logout(token: string): Promise<boolean> {
    // In a real application, invalidate the token by adding it to a blocklist
    // or by removing it from a token store.
    // For now, we'll just return true
    return true;
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    // Find user
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password with bcrypt
    const passwordValid = await bcrypt.compare(currentPassword, user.password);
    if (!passwordValid) {
      throw new Error('Current password is incorrect');
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      throw new Error('New password cannot be the same as the current password');
    }

    // In a real application, update the user's password in the database
    // For now, we'll just return true
    return true;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: number,
    data: Partial<User>
  ): Promise<Omit<User, 'password'>> {
    // Find user
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real application, update the user's profile in the database
    // For now, we'll just return the user with the updated properties
    const updatedUser = { ...user, ...data, updatedAt: new Date() };

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Generate a JWT token for a user
   */
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  }

  /**
   * Find a user by provider and providerId
   */
  private async findUserByProvider(
    provider: string,
    providerId: string
  ): Promise<User | undefined> {
    // In a real application, query the database for a user with matching provider and providerId
    // For now, we'll just return undefined, simulating a new user
    return undefined;
  }
}

export const authService = new AuthService();