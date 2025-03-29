import { Router, Request, Response } from 'express';
import { tiktokService } from '../services/tiktok.service';
import { storage } from '../storage';
import { requireTikTok } from '../middleware/api.middleware';
import { z } from 'zod';

const router = Router();

// Validate TikTok API keys for all TikTok endpoints
router.use(requireTikTok);

// Check if TikTok API is configured
router.get('/status', (req: Request, res: Response) => {
  try {
    const isConfigured = tiktokService.isConfigured();
    res.json({ 
      isConfigured,
      message: isConfigured ? 'TikTok API ready' : 'TikTok API not configured' 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get TikTok auth URL for connecting account
router.post('/auth-url', (req: Request, res: Response) => {
  try {
    const schema = z.object({
      redirectUri: z.string().url(),
      state: z.string().optional(),
      scopes: z.array(z.string()).optional(),
    });
    
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error });
    }
    
    const { redirectUri, state, scopes } = req.body;
    const authUrl = tiktokService.getAuthUrl(redirectUri, state, scopes);
    
    res.json({ authUrl });
  } catch (error: any) {
    console.error('Error generating TikTok auth URL:', error);
    res.status(500).json({ error: error.message });
  }
});

// Exchange auth code for access token
router.post('/access-token', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      code: z.string(),
      redirectUri: z.string().url(),
    });
    
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error });
    }
    
    const { code, redirectUri } = req.body;
    const tokenData = await tiktokService.getAccessToken(code, redirectUri);
    
    // In a real application, you would store these tokens securely
    // For demo purposes, we're returning them to the client
    // In production, store in server-side session or secure database
    res.json(tokenData);
  } catch (error: any) {
    console.error('Error getting TikTok access token:', error);
    res.status(500).json({ error: error.message });
  }
});

// Refresh access token
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      refreshToken: z.string(),
    });
    
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error });
    }
    
    const { refreshToken } = req.body;
    const tokenData = await tiktokService.refreshToken(refreshToken);
    
    res.json(tokenData);
  } catch (error: any) {
    console.error('Error refreshing TikTok token:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user information
router.get('/user', async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token provided' });
    }
    
    const userData = await tiktokService.getUserInfo(accessToken);
    res.json(userData);
  } catch (error: any) {
    console.error('Error getting TikTok user data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's videos
router.get('/videos', async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token provided' });
    }
    
    const cursor = req.query.cursor ? parseInt(req.query.cursor as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    
    const videoData = await tiktokService.getUserVideos(
      accessToken, 
      ['id', 'create_time', 'cover_image_url', 'share_url', 'view_count', 'like_count', 'comment_count'],
      cursor,
      limit
    );
    
    res.json(videoData);
  } catch (error: any) {
    console.error('Error getting TikTok videos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get trending hashtags
router.get('/trending-hashtags', async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token provided' });
    }
    
    const trendingData = await tiktokService.getTrendingHashtags(accessToken);
    res.json(trendingData);
  } catch (error: any) {
    console.error('Error getting TikTok trends:', error);
    res.status(500).json({ error: error.message });
  }
});

// Post new video (placeholder for actual implementation)
router.post('/upload', async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token provided' });
    }
    
    const schema = z.object({
      videoId: z.number(),
      caption: z.string().max(150),
      hashtags: z.string().optional(),
    });
    
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error });
    }
    
    // In a real implementation, you would:
    // 1. Get the video file from storage
    // 2. Upload to TikTok using their video upload API
    // 3. Save the result in your database
    
    // This is a placeholder
    const response = await tiktokService.uploadVideo(accessToken, req.body);
    res.json(response);
  } catch (error: any) {
    console.error('Error uploading to TikTok:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;