import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { requireAuth as authenticate } from '../middleware/auth.middleware';
import { insertUserSchema } from '@shared/schema';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import rateLimit from 'express-rate-limit';

const router = Router();

// Login schema
const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6)
});

// 2FA verification schema
const twoFactorVerifySchema = z.object({
  userId: z.string(),
  code: z.string().min(6).max(10)
});

// 2FA setup verification schema
const twoFactorSetupVerifySchema = z.object({
  code: z.string().min(6).max(10)
});

// Password change schema
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8).max(100)
});

// Social login schema
const socialLoginSchema = z.object({
  provider: z.enum(['google', 'twitter', 'tiktok']),
  providerId: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  profileImageUrl: z.string().nullable()
});

// Profile update schema
const profileUpdateSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  profileImageUrl: z.string().optional(),
  tiktokHandle: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  preferences: z.any().optional(),
  socialProfiles: z.any().optional(),
  contentCreatorInfo: z.any().optional()
});

// Rate limiting implementation

// Rate limiting for auth-related endpoints
const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiting to all auth routes
router.use(authRateLimiter);

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body against schema
    const validatedData = insertUserSchema.parse(req.body);
    
    // Create user
    const role = validatedData.role === 'creator' || validatedData.role === 'admin'
      ? validatedData.role
      : 'user';
    
    const result = await authService.registerWithEmail(
      validatedData.username,
      validatedData.email,
      validatedData.password,
      validatedData.displayName || validatedData.username,
      role
    );
    
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    
    if ((error as Error).message === 'User with this email or username already exists') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    
    next(error);
  }
});

/**
 * @route POST /api/auth/login
 * @desc Log in a user
 * @access Public
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body against schema
    const validatedData = loginSchema.parse(req.body);
    
    // Get IP address and user agent
    const ipAddress = req.ip || '0.0.0.0';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Login user
    const result = await authService.loginWithEmail(
      validatedData.username,
      validatedData.password,
      ipAddress,
      userAgent
    );
    
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    
    if ((error as Error).message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    next(error);
  }
});

/**
 * @route POST /api/auth/verify-2fa
 * @desc Verify 2FA code during login
 * @access Public
 */
router.post('/verify-2fa', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body against schema
    const validatedData = twoFactorVerifySchema.parse(req.body);
    
    // Get IP address and user agent
    const ipAddress = req.ip || '0.0.0.0';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Verify 2FA code
    const result = await authService.verifyTwoFactorCode(
      validatedData.userId,
      validatedData.code,
      ipAddress,
      userAgent
    );
    
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    
    if ((error as Error).message === 'Invalid verification code') {
      return res.status(401).json({ error: 'Invalid verification code' });
    }
    
    next(error);
  }
});

/**
 * @route POST /api/auth/setup-2fa
 * @desc Set up 2FA for a user
 * @access Private
 */
router.post('/setup-2fa', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Setup 2FA
    const result = await authService.setupTwoFactor(req.user.id);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/verify-2fa-setup
 * @desc Verify and enable 2FA after setup
 * @access Private
 */
router.post('/verify-2fa-setup', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate request body against schema
    const validatedData = twoFactorSetupVerifySchema.parse(req.body);
    
    // Verify and enable 2FA
    const result = await authService.verifyAndEnableTwoFactor(req.user.id, validatedData.code);
    
    res.status(200).json({ success: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    
    if ((error as Error).message === 'Invalid verification code') {
      return res.status(401).json({ error: 'Invalid verification code' });
    }
    
    next(error);
  }
});

/**
 * @route POST /api/auth/disable-2fa
 * @desc Disable 2FA for a user
 * @access Private
 */
router.post('/disable-2fa', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate request body
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    // Disable 2FA
    const result = await authService.disableTwoFactor(req.user.id, password);
    
    res.status(200).json({ success: result });
  } catch (error) {
    if ((error as Error).message === 'Invalid password') {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    next(error);
  }
});

/**
 * @route POST /api/auth/social-login
 * @desc Login with a social provider
 * @access Public
 */
router.post('/social-login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body against schema
    const validatedData = socialLoginSchema.parse(req.body);
    
    // Get IP address and user agent
    const ipAddress = req.ip || '0.0.0.0';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Login with social provider
    const result = await authService.loginWithSocialProvider(
      validatedData.provider,
      validatedData.providerId,
      validatedData.email,
      validatedData.displayName,
      validatedData.profileImageUrl,
      ipAddress,
      userAgent
    );
    
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    
    next(error);
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Log out a user
 * @access Private
 */
router.post('/logout', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For our demo session-based auth implementation, no token is required
    // Logout user
    const result = await authService.logout(req.user?.id);
    
    res.status(200).json({ success: result });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', authenticate, (req: Request, res: Response) => {
  res.status(200).json(req.user);
});

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.post('/change-password', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate request body against schema
    const validatedData = passwordChangeSchema.parse(req.body);
    
    // Change password
    const result = await authService.changePassword(
      req.user.id,
      validatedData.currentPassword,
      validatedData.newPassword
    );
    
    res.status(200).json({ success: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    
    if ((error as Error).message === 'Current password is incorrect') {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    if ((error as Error).message === 'New password cannot be the same as the current password') {
      return res.status(400).json({ error: 'New password cannot be the same as the current password' });
    }
    
    next(error);
  }
});

/**
 * @route PATCH /api/auth/update-profile
 * @desc Update user profile
 * @access Private
 */
router.patch('/update-profile', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate request body against schema
    const validatedData = profileUpdateSchema.parse(req.body);
    
    // Update profile
    const updatedUser = await authService.updateProfile(req.user.id, validatedData);
    
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    
    next(error);
  }
});

export default router;