import axios from 'axios';
import { storage } from '../storage';
import { TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET } from '../config/env';

// TikTok API URLs
const TIKTOK_AUTH_URL = 'https://www.tiktok.com/v2/auth/authorize/';
const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2/';

// Types for TikTok API responses
type TiktokTokenResponse = {
  access_token: string;
  refresh_token: string;
  open_id: string;
  expires_in: number;
  refresh_expires_in: number;
  scope: string;
  token_type: string;
};

type TiktokUserInfo = {
  open_id: string;
  union_id: string;
  avatar_url: string;
  avatar_url_100: string;
  avatar_url_200: string;
  display_name: string;
  bio_description: string;
  profile_deep_link: string;
  is_verified: boolean;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
};

type TiktokVideoInfo = {
  id: string;
  create_time: number;
  cover_image_url: string;
  share_url: string;
  video_description: string;
  duration: number;
  height: number;
  width: number;
  title: string;
  embed_link: string;
  embed_html: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  view_count: number;
};

// Type for TikTok connection stored in user model
export type TiktokConnection = {
  accessToken: string;
  refreshToken: string;
  openId: string;
  expiresAt: string;
  refreshExpiresAt: string;
  scope: string;
  connectedAt: string;
};

export class TikTokService {
  private clientKey: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    // Initialize with environment variables
    this.clientKey = TIKTOK_CLIENT_KEY || '';
    this.clientSecret = TIKTOK_CLIENT_SECRET || '';
    
    // Set redirect URI based on environment with proper production support
    // Use REPLIT_DOMAIN for production which is automatically set in Replit
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `https://${process.env.REPLIT_SLUG}.${process.env.REPLIT_DOMAIN || 'replit.app'}`
      : 'http://localhost:5000'; // Changed to 5000 to match the Replit server port
    
    // Allow override with explicit REDIRECT_BASE_URL environment variable
    this.redirectUri = `${process.env.REDIRECT_BASE_URL || baseUrl}/api/tiktok/callback`;
  }

  /**
   * Generate a TikTok authentication URL
   */
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_key: this.clientKey,
      response_type: 'code',
      scope: 'user.info.basic,user.info.profile,user.info.stats,video.list',
      redirect_uri: this.redirectUri,
      state
    });

    return `${TIKTOK_AUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchange the authorization code for an access token
   */
  async getAccessToken(code: string): Promise<TiktokTokenResponse> {
    try {
      const params = new URLSearchParams({
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      });

      const response = await axios.post(TIKTOK_TOKEN_URL, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data.data;
    } catch (error) {
      console.error('Error getting TikTok access token:', error);
      throw new Error('Failed to get TikTok access token');
    }
  }

  /**
   * Refresh an expired access token
   */
  async refreshToken(refreshToken: string): Promise<TiktokTokenResponse | null> {
    try {
      const params = new URLSearchParams({
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      });

      const response = await axios.post(TIKTOK_TOKEN_URL, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data.data;
    } catch (error) {
      console.error('Error refreshing TikTok token:', error);
      return null;
    }
  }

  /**
   * Validate and refresh the token if needed
   */
  async validateToken(connection: TiktokConnection): Promise<boolean> {
    try {
      const now = new Date();
      const expiresAt = new Date(connection.expiresAt);
      const refreshExpiresAt = new Date(connection.refreshExpiresAt);

      // If the refresh token has expired, authentication is required
      if (now > refreshExpiresAt) {
        return false;
      }

      // If the access token is about to expire (within 10 mins), refresh it
      if (now > new Date(expiresAt.getTime() - 10 * 60 * 1000)) {
        const refreshedToken = await this.refreshToken(connection.refreshToken);
        
        if (!refreshedToken) {
          return false;
        }

        // Update the user's token information
        await this.updateUserToken(connection.openId, refreshedToken);
      }

      return true;
    } catch (error) {
      console.error('Error validating TikTok token:', error);
      return false;
    }
  }

  /**
   * Update the user's TikTok token information
   */
  private async updateUserToken(openId: string, tokenData: TiktokTokenResponse): Promise<void> {
    try {
      // Get all users and find one with matching TikTok openId
      // Note: In a real DB implementation, we would use a query instead
      const allUsers = await Promise.all(
        Array.from({ length: 100 }, (_, i) => storage.getUser(i + 1)).filter(Boolean)
      );
      
      const user = allUsers.find(u => 
        u && 
        u.tiktokConnection && 
        typeof u.tiktokConnection === 'object' && 
        'openId' in u.tiktokConnection && 
        u.tiktokConnection.openId === openId
      );

      if (user) {
        // We need to type cast since tiktokConnection might be a JSON object
        const currentConnection = user.tiktokConnection as TiktokConnection;
        
        await storage.updateUser(user.id, {
          tiktokConnection: {
            openId: currentConnection.openId,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
            refreshExpiresAt: new Date(Date.now() + tokenData.refresh_expires_in * 1000).toISOString(),
            scope: tokenData.scope,
            connectedAt: currentConnection.connectedAt || new Date().toISOString()
          }
        });
      }
    } catch (error) {
      console.error('Error updating user token:', error);
    }
  }

  /**
   * Get user profile information from TikTok
   */
  async getUserProfile(connection: TiktokConnection): Promise<any> {
    try {
      const response = await axios.get(`${TIKTOK_API_BASE}user/info/`, {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`
        }
      });

      const userInfo: TiktokUserInfo = response.data.data.user;
      
      return {
        openId: userInfo.open_id,
        displayName: userInfo.display_name,
        bio: userInfo.bio_description,
        avatarUrl: userInfo.avatar_url,
        profileUrl: userInfo.profile_deep_link,
        verified: userInfo.is_verified,
        followerCount: userInfo.follower_count,
        followingCount: userInfo.following_count,
        likesCount: userInfo.likes_count,
        videoCount: userInfo.video_count
      };
    } catch (error) {
      console.error('Error getting TikTok user profile:', error);
      throw new Error('Failed to get TikTok user profile');
    }
  }

  /**
   * Import videos from TikTok
   */
  async importVideos(userId: number, connection: TiktokConnection, limit: number = 10): Promise<any[]> {
    try {
      // Get videos from TikTok API
      const response = await axios.get(`${TIKTOK_API_BASE}video/list/`, {
        params: {
          fields: ['id', 'create_time', 'cover_image_url', 'share_url', 'video_description', 'duration', 
                  'height', 'width', 'title', 'embed_link', 'embed_html', 'like_count', 'comment_count', 
                  'share_count', 'view_count'].join(','),
          cursor: 0,
          max_count: limit
        },
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`
        }
      });

      const videos: TiktokVideoInfo[] = response.data.data.videos;
      const importedVideos = [];

      // Get all existing videos for the user
      const existingVideos = await storage.getVideosByUserId(userId);

      // Process each video and save to our system
      for (const video of videos) {
        // Check if video already exists by comparing external IDs
        const exists = existingVideos.some(v => {
          if (!v.externalData) return false;
          
          try {
            // Parse externalData if it's a string
            const externalData = typeof v.externalData === 'string' 
              ? JSON.parse(v.externalData) 
              : v.externalData;
              
            return externalData && 
                   externalData.tiktok && 
                   externalData.tiktok.id === video.id;
          } catch (e) {
            return false;
          }
        });

        if (!exists) {
          // Create new video in our system
          // Note: We create a valid InsertVideo object that matches our schema
          const newVideo = await storage.createVideo({
            userId,
            title: video.title || video.video_description.substring(0, 50),
            description: video.video_description,
            thumbnailUrl: video.cover_image_url,
            createdAt: new Date(video.create_time * 1000),
            views: video.view_count,
            likes: video.like_count,
            comments: video.comment_count,
            shares: video.share_count,
            // Set hashtags to empty array as required by the schema
            hashtags: [],
            // Status and platform are stored in externalData
            externalData: {
              platform: 'tiktok',
              status: 'published',
              tiktok: {
                id: video.id,
                shareUrl: video.share_url,
                embedLink: video.embed_link,
                embedHtml: video.embed_html,
                duration: video.duration,
                dimensions: {
                  height: video.height,
                  width: video.width
                },
                importedAt: new Date().toISOString()
              }
            }
          });

          importedVideos.push(newVideo);
        }
      }

      return importedVideos;
    } catch (error) {
      console.error('Error importing TikTok videos:', error);
      throw new Error('Failed to import TikTok videos');
    }
  }
}