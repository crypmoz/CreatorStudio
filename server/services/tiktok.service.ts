import { TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET } from '../config/env';

/**
 * TikTok API Service
 * Handles all communication with the TikTok API for creator-related functionality
 */
export class TikTokService {
  private clientKey: string;
  private clientSecret: string;
  private apiVersion: string = 'v2';
  private baseUrl: string = 'https://open.tiktokapis.com';
  private accessToken: string | null = null;
  private expiresAt: number = 0;
  
  constructor() {
    this.clientKey = TIKTOK_CLIENT_KEY;
    this.clientSecret = TIKTOK_CLIENT_SECRET;
    
    // Log configuration status
    if (!this.clientKey || !this.clientSecret) {
      console.warn('TikTok API not fully configured. Set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET to enable TikTok features.');
    } else {
      console.log('TikTok API configured successfully.');
    }
  }
  
  /**
   * Check if TikTok API is properly configured
   */
  isConfigured(): boolean {
    return !!(this.clientKey && this.clientSecret);
  }
  
  /**
   * Generate OAuth authorization URL for TikTok login
   */
  getAuthUrl(redirectUri: string, state: string = 'state', scope: string[] = ['user.info.basic']): string {
    if (!this.isConfigured()) {
      throw new Error('TikTok API not configured');
    }
    
    const scopes = scope.join(',');
    return `https://www.tiktok.com/auth/authorize/?client_key=${this.clientKey}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${state}`;
  }
  
  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code: string, redirectUri: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('TikTok API not configured');
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/oauth/access_token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: this.clientKey,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }).toString(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get access token');
      }
      
      const data = await response.json();
      this.accessToken = data.access_token;
      this.expiresAt = Date.now() + (data.expires_in * 1000);
      
      return data;
    } catch (error) {
      console.error('Error getting TikTok access token:', error);
      throw error;
    }
  }
  
  /**
   * Refresh the access token before it expires
   */
  async refreshToken(refreshToken: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('TikTok API not configured');
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/oauth/refresh_token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: this.clientKey,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }).toString(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to refresh token');
      }
      
      const data = await response.json();
      this.accessToken = data.access_token;
      this.expiresAt = Date.now() + (data.expires_in * 1000);
      
      return data;
    } catch (error) {
      console.error('Error refreshing TikTok token:', error);
      throw error;
    }
  }
  
  /**
   * Get user information
   */
  async getUserInfo(accessToken: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('TikTok API not configured');
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/${this.apiVersion}/user/info/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get user info');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting TikTok user info:', error);
      throw error;
    }
  }
  
  /**
   * Get user's videos
   */
  async getUserVideos(accessToken: string, fields: string[] = ['id', 'create_time', 'cover_image_url', 'share_url', 'view_count', 'like_count', 'comment_count'], cursor: number = 0, limit: number = 20): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('TikTok API not configured');
    }
    
    try {
      const queryParams = new URLSearchParams({
        fields: fields.join(','),
        cursor: cursor.toString(),
        max_count: limit.toString(),
      });
      
      const response = await fetch(`${this.baseUrl}/${this.apiVersion}/video/list/?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get user videos');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting TikTok user videos:', error);
      throw error;
    }
  }
  
  /**
   * Upload a video to TikTok (abstract implementation)
   * Note: Actual implementation would follow TikTok's upload process
   */
  async uploadVideo(accessToken: string, videoData: any): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('TikTok API not configured');
    }
    
    // This is a placeholder - actual implementation would follow TikTok's
    // specific video upload process which is more complex
    console.log('Uploading video to TikTok:', videoData);
    return { success: true, videoId: 'mock-video-id' };
  }
  
  /**
   * Get video analytics
   */
  async getVideoAnalytics(accessToken: string, videoId: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('TikTok API not configured');
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/${this.apiVersion}/video/data/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        // Note: TikTok API may require different parameters
        // This is a simplified example
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get video analytics');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting TikTok video analytics:', error);
      throw error;
    }
  }
  
  /**
   * Get trending hashtags on TikTok
   * Note: May require specific API access
   */
  async getTrendingHashtags(accessToken: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('TikTok API not configured');
    }
    
    // This is a placeholder - TikTok may offer this through a research API
    // or it might require a custom implementation using their other endpoints
    console.log('Getting trending hashtags from TikTok');
    return {
      trends: [
        { name: '#fyp', viewCount: 1000000 },
        { name: '#viral', viewCount: 900000 },
        { name: '#trending', viewCount: 800000 },
        // More trends would be returned in real implementation
      ]
    };
  }
}

// Export a singleton instance
export const tiktokService = new TikTokService();