import express, { Request, Response } from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import { requireTikTok } from '../middleware/api.middleware';
import { TikTokService, TiktokConnection } from '../services/tiktok.service';
import { storage } from '../storage';
import { TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET } from '../config/env';

const router = express.Router();
const tiktokService = new TikTokService();

// Map to store state tokens for auth flow
const stateTokens = new Map<string, { userId: number, expiry: Date }>();

/**
 * Generate a TikTok auth URL for the current user
 * @route GET /api/tiktok/auth-url
 */
router.get('/auth-url', isAuthenticated, requireTikTok, async (req, res) => {
  try {
    // Generate a random state token to prevent CSRF
    const state = Math.random().toString(36).substring(2, 15);
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // Token valid for 1 hour
    
    // Store the state token with the user ID
    if (req.user) {
      stateTokens.set(state, { 
        userId: req.user.id, 
        expiry 
      });
    }
    
    // Generate auth URL
    const authUrl = tiktokService.getAuthUrl(state);
    
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating TikTok auth URL:', error);
    res.status(500).json({ message: 'Failed to generate TikTok authentication URL' });
  }
});

/**
 * Handle the TikTok OAuth callback
 * @route GET /api/tiktok/callback
 */
router.get('/callback', requireTikTok, async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    
    // Handle error from TikTok
    if (error) {
      console.error(`TikTok auth error: ${error}. ${error_description}`);
      return res.redirect('/account-settings?tiktok=error');
    }
    
    // Validate state token to prevent CSRF
    if (!state || typeof state !== 'string' || !stateTokens.has(state)) {
      return res.redirect('/account-settings?tiktok=invalid-state');
    }
    
    const stateData = stateTokens.get(state as string);
    
    // Check if token is expired
    if (!stateData || stateData.expiry < new Date()) {
      stateTokens.delete(state as string);
      return res.redirect('/account-settings?tiktok=expired');
    }
    
    // Exchange code for access token
    if (typeof code === 'string') {
      const tokenData = await tiktokService.getAccessToken(code);
      
      // Save the token data to the user's account
      const user = await storage.getUser(stateData.userId);
      
      if (user) {
        const updatedUser = await storage.updateUser(stateData.userId, {
          tiktokConnection: {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            openId: tokenData.open_id,
            expiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
            refreshExpiresAt: new Date(Date.now() + tokenData.refresh_expires_in * 1000).toISOString(),
            scope: tokenData.scope,
            connectedAt: new Date().toISOString()
          }
        });
        
        // Clean up state token
        stateTokens.delete(state as string);
        
        // Redirect to account settings page with success
        return res.redirect('/account-settings?tiktok=connected');
      } else {
        return res.redirect('/account-settings?tiktok=user-not-found');
      }
    } else {
      return res.redirect('/account-settings?tiktok=no-code');
    }
  } catch (error) {
    console.error('Error handling TikTok callback:', error);
    res.redirect('/account-settings?tiktok=error');
  }
});

/**
 * Import TikTok videos for the authenticated user
 * @route POST /api/tiktok/import-videos
 */
router.post('/import-videos', isAuthenticated, requireTikTok, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await storage.getUser(req.user.id);
    
    if (!user || !user.tiktokConnection) {
      return res.status(400).json({ 
        message: 'TikTok account not connected',
        requiresAuth: true
      });
    }
    
    // Check if token is still valid, refresh if needed
    const tiktokConnection = user.tiktokConnection as TiktokConnection;
    const tokenValid = await tiktokService.validateToken(tiktokConnection);
    if (!tokenValid) {
      // If we couldn't refresh, user needs to re-authenticate
      return res.status(401).json({ 
        message: 'TikTok authentication expired',
        requiresAuth: true
      });
    }
    
    // Get limit from request body or default to 10
    const { limit = 10 } = req.body;
    
    // Import videos
    const videos = await tiktokService.importVideos(user.id, tiktokConnection, limit);
    
    res.json({ 
      message: 'Videos imported successfully',
      count: videos.length,
      videos
    });
  } catch (error) {
    console.error('Error importing TikTok videos:', error);
    res.status(500).json({ message: 'Failed to import TikTok videos' });
  }
});

/**
 * Get TikTok account connection status
 * @route GET /api/tiktok/connection-status
 */
router.get('/connection-status', isAuthenticated, requireTikTok, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await storage.getUser(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has a TikTok connection
    const isConnected = !!user.tiktokConnection;
    
    let profile = null;
    if (isConnected && user.tiktokConnection) {
      // Get profile data if connection exists
      try {
        const tiktokConnection = user.tiktokConnection as TiktokConnection;
        profile = await tiktokService.getUserProfile(tiktokConnection);
      } catch (error) {
        console.error('Error fetching TikTok profile:', error);
      }
    }
    
    res.json({
      connected: isConnected,
      connectedSince: isConnected ? (user.tiktokConnection as TiktokConnection).connectedAt : null,
      profile
    });
  } catch (error) {
    console.error('Error checking TikTok connection status:', error);
    res.status(500).json({ message: 'Failed to check TikTok connection status' });
  }
});

/**
 * Disconnect TikTok account
 * @route POST /api/tiktok/disconnect
 */
router.post('/disconnect', isAuthenticated, requireTikTok, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Update user to remove TikTok connection
    const updatedUser = await storage.updateUser(req.user.id, {
      tiktokConnection: null
    });
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'TikTok account disconnected successfully' 
    });
  } catch (error) {
    console.error('Error disconnecting TikTok account:', error);
    res.status(500).json({ message: 'Failed to disconnect TikTok account' });
  }
});

/**
 * @route GET /api/tiktok/validate-api
 * @desc Validate if TikTok API keys are set
 * @access Private
 */
router.get('/validate-api', isAuthenticated, async (req, res) => {
  try {
    const isAvailable = !!(TIKTOK_CLIENT_KEY && TIKTOK_CLIENT_SECRET);
    res.json({ available: isAvailable });
  } catch (error) {
    console.error('Error checking TikTok API:', error);
    res.status(500).json({ message: 'Failed to check TikTok API availability' });
  }
});

/**
 * @route GET /api/tiktok/test-api
 * @desc Test endpoint for TikTok API keys validation (no auth required)
 * @access Public
 */
router.get('/test-api', async (req, res) => {
  try {
    const isAvailable = !!(TIKTOK_CLIENT_KEY && TIKTOK_CLIENT_SECRET);
    
    if (isAvailable) {
      try {
        // This is a simple test to see if TikTok API keys are properly formatted
        // Note: We can't fully validate the keys without user authorization
        const authUrl = tiktokService.getAuthUrl('test_state_token');
        
        res.json({
          available: true,
          valid: true, 
          message: 'TikTok API keys are configured and appear to be valid',
          authUrl: authUrl // Include the auth URL just to show it's working
        });
      } catch (apiError: any) {
        console.error('Error testing TikTok API:', apiError);
        res.json({
          available: true,
          valid: false,
          message: 'TikTok API keys are configured but may not be valid',
          error: apiError.message
        });
      }
    } else {
      res.json({ 
        available: false,
        valid: false,
        message: 'TikTok API keys are not configured'
      });
    }
  } catch (error) {
    console.error('Error testing TikTok API:', error);
    res.status(500).json({ message: 'Failed to test TikTok API availability' });
  }
});

export default router;