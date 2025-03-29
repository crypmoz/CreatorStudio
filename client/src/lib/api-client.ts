import { apiRequest } from './queryClient';
import type { User, InsertUser, Video, InsertVideo, ContentTemplate, ContentIdea, ContentDraft, ScheduledPost, Analytics } from '@shared/schema';

// AUTH API
export const AuthAPI = {
  login: async (credentials: { username: string; password: string }): Promise<User> => {
    return await apiRequest('POST', '/api/login', credentials);
  },
  
  register: async (userData: InsertUser): Promise<User> => {
    return await apiRequest('POST', '/api/register', userData);
  },
  
  logout: async (): Promise<void> => {
    await apiRequest('POST', '/api/logout');
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    try {
      return await apiRequest('GET', '/api/user');
    } catch (error) {
      if ((error as Error).message.includes('401')) {
        return null;
      }
      throw error;
    }
  },
  
  updateUser: async (userId: number, userData: Partial<User>): Promise<User> => {
    return await apiRequest('PATCH', `/api/users/${userId}`, userData);
  }
};

// CONTENT API
export const ContentAPI = {
  // Templates
  getTemplates: async (): Promise<ContentTemplate[]> => {
    return await apiRequest('GET', '/api/content-templates');
  },
  
  getTemplate: async (id: number): Promise<ContentTemplate> => {
    return await apiRequest('GET', `/api/content-templates/${id}`);
  },
  
  createTemplate: async (template: Omit<ContentTemplate, 'id'>): Promise<ContentTemplate> => {
    return await apiRequest('POST', '/api/content-templates', template);
  },
  
  updateTemplate: async (id: number, data: Partial<ContentTemplate>): Promise<ContentTemplate> => {
    return await apiRequest('PATCH', `/api/content-templates/${id}`, data);
  },
  
  deleteTemplate: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/content-templates/${id}`);
  },
  
  // Ideas
  getUserIdeas: async (userId: number): Promise<ContentIdea[]> => {
    return await apiRequest('GET', `/api/users/${userId}/content-ideas`);
  },
  
  createIdea: async (idea: Omit<ContentIdea, 'id'>): Promise<ContentIdea> => {
    return await apiRequest('POST', '/api/content-ideas', idea);
  },
  
  updateIdea: async (id: number, data: Partial<ContentIdea>): Promise<ContentIdea> => {
    return await apiRequest('PATCH', `/api/content-ideas/${id}`, data);
  },
  
  // Drafts
  getUserDrafts: async (userId: number): Promise<ContentDraft[]> => {
    return await apiRequest('GET', `/api/users/${userId}/content-drafts`);
  },
  
  createDraft: async (draft: Omit<ContentDraft, 'id'>): Promise<ContentDraft> => {
    return await apiRequest('POST', '/api/content-drafts', draft);
  },
  
  updateDraft: async (id: number, data: Partial<ContentDraft>): Promise<ContentDraft> => {
    return await apiRequest('PATCH', `/api/content-drafts/${id}`, data);
  }
};

// VIDEOS API
export const VideoAPI = {
  getUserVideos: async (userId: number): Promise<Video[]> => {
    return await apiRequest('GET', `/api/users/${userId}/videos`);
  },
  
  getVideo: async (id: number): Promise<Video> => {
    return await apiRequest('GET', `/api/videos/${id}`);
  },
  
  createVideo: async (videoData: InsertVideo): Promise<Video> => {
    return await apiRequest('POST', '/api/videos', videoData);
  },
  
  updateVideoStats: async (id: number, stats: Partial<Video>): Promise<Video> => {
    return await apiRequest('PATCH', `/api/videos/${id}/stats`, stats);
  },
  
  getVideoComments: async (videoId: number): Promise<Comment[]> => {
    return await apiRequest('GET', `/api/videos/${videoId}/comments`);
  }
};

// SCHEDULER API
export const SchedulerAPI = {
  getUserScheduledPosts: async (userId: number): Promise<ScheduledPost[]> => {
    return await apiRequest('GET', `/api/users/${userId}/scheduled-posts`);
  },
  
  createScheduledPost: async (postData: Omit<ScheduledPost, 'id'>): Promise<ScheduledPost> => {
    return await apiRequest('POST', '/api/scheduled-posts', postData);
  },
  
  updateScheduledPost: async (id: number, data: Partial<ScheduledPost>): Promise<ScheduledPost> => {
    return await apiRequest('PATCH', `/api/scheduled-posts/${id}`, data);
  },
  
  deleteScheduledPost: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/scheduled-posts/${id}`);
  }
};

// ANALYTICS API
export const AnalyticsAPI = {
  getUserAnalytics: async (userId: number): Promise<Analytics> => {
    return await apiRequest('GET', `/api/users/${userId}/analytics`);
  },
  
  getUserRevenue: async (userId: number): Promise<any[]> => {
    return await apiRequest('GET', `/api/users/${userId}/revenue`);
  }
};

// TIKTOK API INTEGRATION
export const TikTokAPI = {
  getConnectionStatus: async (): Promise<{ connected: boolean; username?: string }> => {
    return await apiRequest('GET', '/api/tiktok/connection-status');
  },
  
  getAuthUrl: async (): Promise<{ url: string }> => {
    return await apiRequest('GET', '/api/tiktok/auth-url');
  },
  
  disconnect: async (): Promise<void> => {
    await apiRequest('POST', '/api/tiktok/disconnect');
  },
  
  fetchUserData: async (): Promise<any> => {
    return await apiRequest('GET', '/api/tiktok/user-data');
  },
  
  fetchVideos: async (): Promise<any[]> => {
    return await apiRequest('GET', '/api/tiktok/videos');
  },
  
  analyzeVideo: async (videoUrl: string): Promise<any> => {
    return await apiRequest('POST', '/api/tiktok/analyze-video', { videoUrl });
  }
};

// AI SERVICES API
export const AIAPI = {
  generateContentIdea: async (prompt: string, category?: string): Promise<{ idea: string; title: string }> => {
    return await apiRequest('POST', '/api/ai/generate-idea', { prompt, category });
  },
  
  enhanceContent: async (content: string, style?: string): Promise<{ enhancedContent: string }> => {
    return await apiRequest('POST', '/api/ai/enhance-content', { content, style });
  },
  
  generateCaption: async (videoDescription: string, keywords?: string[]): Promise<{ caption: string }> => {
    return await apiRequest('POST', '/api/ai/generate-caption', { videoDescription, keywords });
  },
  
  analyzeAudience: async (data: any): Promise<{ insights: any }> => {
    return await apiRequest('POST', '/api/ai/analyze-audience', data);
  },
  
  predictVirality: async (content: string, metadata: any): Promise<{ score: number; feedback: string }> => {
    return await apiRequest('POST', '/api/ai/predict-virality', { content, metadata });
  }
};