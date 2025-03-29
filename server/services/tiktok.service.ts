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
type TiktokConnection = {
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
    
    // Set redirect URI based on environment
    // In production, this would come from environment variables
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-url.com' 
      : 'http://localhost:3000';
    
    this.redirectUri = `${baseUrl}/api/tiktok/callback`;
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
      // Find user by TikTok openId
      const users = Array.from(storage.users.values());
      const user = users.find(u => u.tiktokConnection && u.tiktokConnection.openId === openId);

      if (user) {
        await storage.updateUser(user.id, {
          tiktokConnection: {
            ...user.tiktokConnection,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
            refreshExpiresAt: new Date(Date.now() + tokenData.refresh_expires_in * 1000).toISOString(),
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

      // Process each video and save to our system
      for (const video of videos) {
        // Check if video already exists
        const existingVideos = Array.from(storage.videos.values());
        const exists = existingVideos.some(v => 
          v.externalData && 
          typeof v.externalData === 'object' && 
          v.externalData.tiktok && 
          v.externalData.tiktok.id === video.id
        );

        if (!exists) {
          // Create new video in our system
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
            platform: 'tiktok',
            status: 'published',
            externalData: {
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