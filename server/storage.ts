import {
  User, InsertUser,
  Video, InsertVideo,
  ContentTemplate, InsertContentTemplate,
  ScheduledPost, InsertScheduledPost,
  Comment, InsertComment,
  Revenue, InsertRevenue,
  Analytics, InsertAnalytics,
  ContentIdea, InsertContentIdea,
  ContentDraft, InsertContentDraft,
  MediaFile, InsertMediaFile
} from "@shared/schema";

import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session Store
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Video operations
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByUserId(userId: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideoStats(id: number, stats: Partial<Video>): Promise<Video | undefined>;
  
  // Content Template operations
  getContentTemplate(id: number): Promise<ContentTemplate | undefined>;
  getContentTemplates(): Promise<ContentTemplate[]>;
  createContentTemplate(template: InsertContentTemplate): Promise<ContentTemplate>;
  
  // Scheduled Post operations
  getScheduledPost(id: number): Promise<ScheduledPost | undefined>;
  getScheduledPostsByUserId(userId: number): Promise<ScheduledPost[]>;
  createScheduledPost(post: InsertScheduledPost): Promise<ScheduledPost>;
  updateScheduledPost(id: number, data: Partial<ScheduledPost>): Promise<ScheduledPost | undefined>;
  deleteScheduledPost(id: number): Promise<boolean>;
  getScheduledPostsDueForPublishing(beforeDate: Date): Promise<ScheduledPost[]>;
  
  // Comment operations
  getComment(id: number): Promise<Comment | undefined>;
  getCommentsByVideoId(videoId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Revenue operations
  getRevenue(id: number): Promise<Revenue | undefined>;
  getRevenueByUserId(userId: number): Promise<Revenue[]>;
  getRevenueByUserIdAndPeriod(userId: number, startDate: Date, endDate: Date): Promise<Revenue[]>;
  createRevenue(revenue: InsertRevenue): Promise<Revenue>;
  
  // Analytics operations
  getAnalytics(id: number): Promise<Analytics | undefined>;
  getLatestAnalyticsByUserId(userId: number): Promise<Analytics | undefined>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(id: number, data: Partial<Analytics>): Promise<Analytics | undefined>;
  
  // Content Idea operations
  getContentIdea(id: number): Promise<ContentIdea | undefined>;
  getContentIdeasByUserId(userId: number): Promise<ContentIdea[]>;
  createContentIdea(idea: InsertContentIdea): Promise<ContentIdea>;
  updateContentIdea(id: number, data: Partial<ContentIdea>): Promise<ContentIdea | undefined>;
  
  // Content Draft operations
  getContentDraft(id: number): Promise<ContentDraft | undefined>;
  getContentDraftsByUserId(userId: number): Promise<ContentDraft[]>;
  getContentDraftsByIdeaId(ideaId: number): Promise<ContentDraft[]>;
  createContentDraft(draft: InsertContentDraft): Promise<ContentDraft>;
  updateContentDraft(id: number, data: Partial<ContentDraft>): Promise<ContentDraft | undefined>;
  
  // Media File operations
  getMediaFile(id: number): Promise<MediaFile | undefined>;
  getMediaFilesByUserId(userId: number): Promise<MediaFile[]>;
  getMediaFilesByDraftId(draftId: number): Promise<MediaFile[]>;
  createMediaFile(file: InsertMediaFile): Promise<MediaFile>;
  updateMediaFile(id: number, data: Partial<MediaFile>): Promise<MediaFile | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private videos: Map<number, Video>;
  private contentTemplates: Map<number, ContentTemplate>;
  private scheduledPosts: Map<number, ScheduledPost>;
  private comments: Map<number, Comment>;
  private revenues: Map<number, Revenue>;
  private analytics: Map<number, Analytics>;
  private contentIdeas: Map<number, ContentIdea>;
  private contentDrafts: Map<number, ContentDraft>;
  private mediaFiles: Map<number, MediaFile>;
  
  private currentUserId: number;
  private currentVideoId: number;
  private currentTemplateId: number;
  private currentPostId: number;
  private currentCommentId: number;
  private currentRevenueId: number;
  private currentAnalyticsId: number;
  private currentContentIdeaId: number;
  private currentContentDraftId: number;
  private currentMediaFileId: number;
  
  // Session store for authentication
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.videos = new Map();
    this.contentTemplates = new Map();
    this.scheduledPosts = new Map();
    this.comments = new Map();
    this.revenues = new Map();
    this.analytics = new Map();
    this.contentIdeas = new Map();
    this.contentDrafts = new Map();
    this.mediaFiles = new Map();
    
    this.currentUserId = 1;
    this.currentVideoId = 1;
    this.currentTemplateId = 1;
    this.currentPostId = 1;
    this.currentCommentId = 1;
    this.currentRevenueId = 1;
    this.currentAnalyticsId = 1;
    this.currentContentIdeaId = 1;
    this.currentContentDraftId = 1;
    this.currentMediaFileId = 1;
    
    // Initialize session store with memory store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with some demo data
    this.initializeDemoData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    // Don't allow updating certain fields
    const { password, id: userId, ...updatableFields } = userData;
    
    const updatedUser = { 
      ...user, 
      ...updatableFields,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    // Ensure null values for optional fields
    const user: User = { 
      ...insertUser, 
      id,
      bio: insertUser.bio || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      role: insertUser.role || "creator",
      provider: "email",
      providerId: null,
      tiktokHandle: insertUser.tiktokHandle || null,
      country: insertUser.country || null,
      dateOfBirth: null,
      phoneNumber: null,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      twoFactorEnabled: false,
      twoFactorSecret: null,
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
        avgViews: 0,
        avgEngagement: 0,
        contentFrequency: "weekly"
      }
    };
    this.users.set(id, user);
    
    // Create default analytics for the new user
    const analytics: Analytics = {
      id: this.currentAnalyticsId++,
      userId: id,
      date: new Date(),
      totalViews: 0,
      followers: 0,
      engagement: 0,
      estimatedRevenue: 0,
      topContentTypes: [],
      impressionsByDemographic: {},
      watchTime: 0,
      conversionRate: 0,
      shareRate: 0
    };
    
    this.analytics.set(analytics.id, analytics);
    
    return user;
  }
  
  // Video operations
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }
  
  async getVideosByUserId(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(
      (video) => video.userId === userId
    );
  }
  
  async createVideo(video: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    // Ensure all required fields have proper null values if not provided
    const newVideo: Video = { 
      ...video, 
      id,
      description: video.description || null,
      thumbnailUrl: video.thumbnailUrl || null,
      views: video.views || null,
      likes: video.likes || null,
      shares: video.shares || null,
      comments: video.comments || null,
      watchTime: video.watchTime || null,
      completionRate: video.completionRate || null,
      viralityScore: video.viralityScore || null,
      createdAt: video.createdAt || null,
      hashtags: video.hashtags || null
    };
    this.videos.set(id, newVideo);
    return newVideo;
  }
  
  async updateVideoStats(id: number, stats: Partial<Video>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updatedVideo = { ...video, ...stats };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }
  
  // Content Template operations
  async getContentTemplate(id: number): Promise<ContentTemplate | undefined> {
    return this.contentTemplates.get(id);
  }
  
  async getContentTemplates(): Promise<ContentTemplate[]> {
    return Array.from(this.contentTemplates.values());
  }
  
  async createContentTemplate(template: InsertContentTemplate): Promise<ContentTemplate> {
    const id = this.currentTemplateId++;
    // Ensure all optional fields have proper null values
    const newTemplate: ContentTemplate = { 
      ...template, 
      id,
      thumbnailUrl: template.thumbnailUrl || null,
      avgViews: template.avgViews || null,
      popularity: template.popularity || null,
      isNew: template.isNew || null
    };
    this.contentTemplates.set(id, newTemplate);
    return newTemplate;
  }
  
  // Scheduled Post operations
  async getScheduledPost(id: number): Promise<ScheduledPost | undefined> {
    return this.scheduledPosts.get(id);
  }
  
  async getScheduledPostsByUserId(userId: number): Promise<ScheduledPost[]> {
    return Array.from(this.scheduledPosts.values()).filter(
      (post) => post.userId === userId
    );
  }
  
  async createScheduledPost(post: InsertScheduledPost): Promise<ScheduledPost> {
    const id = this.currentPostId++;
    // Ensure all optional fields have proper null values
    const newPost: ScheduledPost = { 
      ...post, 
      id,
      thumbnailUrl: post.thumbnailUrl || null,
      platforms: post.platforms || null,
      description: post.description || null,
      content: post.content || null,
      contentDraftId: post.contentDraftId || null,
      mediaFileId: post.mediaFileId || null,
      timeZone: post.timeZone || 'UTC',
      status: post.status || 'pending',
      platformSpecificSettings: post.platformSpecificSettings || {},
      repeatSchedule: post.repeatSchedule || null,
      lastPublishedAt: post.lastPublishedAt || null,
      publishResults: post.publishResults || [],
      isOptimalTimeSelected: post.isOptimalTimeSelected || false,
      createdAt: post.createdAt || new Date(),
      updatedAt: post.updatedAt || new Date()
    };
    this.scheduledPosts.set(id, newPost);
    return newPost;
  }
  
  async updateScheduledPost(id: number, data: Partial<ScheduledPost>): Promise<ScheduledPost | undefined> {
    const post = this.scheduledPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...data, updatedAt: new Date() };
    this.scheduledPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteScheduledPost(id: number): Promise<boolean> {
    if (!this.scheduledPosts.has(id)) return false;
    return this.scheduledPosts.delete(id);
  }
  
  async getScheduledPostsDueForPublishing(beforeDate: Date): Promise<ScheduledPost[]> {
    return Array.from(this.scheduledPosts.values()).filter(
      (post) => 
        post.status === 'pending' &&
        post.scheduledFor !== null &&
        post.scheduledFor <= beforeDate
    );
  }
  
  // Comment operations
  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }
  
  async getCommentsByVideoId(videoId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.videoId === videoId
    );
  }
  
  async createComment(comment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    // Ensure all optional fields have proper null values
    const newComment: Comment = { 
      ...comment, 
      id,
      likes: comment.likes || null,
      avatarUrl: comment.avatarUrl || null,
      timestamp: comment.timestamp || null
    };
    this.comments.set(id, newComment);
    return newComment;
  }
  
  // Revenue operations
  async getRevenue(id: number): Promise<Revenue | undefined> {
    return this.revenues.get(id);
  }
  
  async getRevenueByUserId(userId: number): Promise<Revenue[]> {
    return Array.from(this.revenues.values()).filter(
      (revenue) => revenue.userId === userId
    );
  }
  
  async getRevenueByUserIdAndPeriod(userId: number, startDate: Date, endDate: Date): Promise<Revenue[]> {
    return Array.from(this.revenues.values()).filter(
      (revenue) => 
        revenue.userId === userId && 
        revenue.date != null && 
        revenue.date >= startDate && 
        revenue.date <= endDate
    );
  }
  
  async createRevenue(revData: InsertRevenue): Promise<Revenue> {
    const id = this.currentRevenueId++;
    // Ensure date has proper null value if not provided
    const newRevenue: Revenue = { 
      ...revData, 
      id,
      date: revData.date || null
    };
    this.revenues.set(id, newRevenue);
    return newRevenue;
  }
  
  // Analytics operations
  async getAnalytics(id: number): Promise<Analytics | undefined> {
    return this.analytics.get(id);
  }
  
  async getLatestAnalyticsByUserId(userId: number): Promise<Analytics | undefined> {
    const userAnalytics = Array.from(this.analytics.values()).filter(
      (analytics) => analytics.userId === userId
    );
    
    if (userAnalytics.length === 0) return undefined;
    
    // Return the latest analytics entry, checking for null dates
    return userAnalytics.reduce((latest, current) => {
      if (!latest.date) return current;
      if (!current.date) return latest;
      return latest.date > current.date ? latest : current;
    });
  }
  
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    // Ensure all optional fields have proper null values
    const newAnalytics: Analytics = { 
      ...analyticsData, 
      id,
      date: analyticsData.date || null,
      totalViews: analyticsData.totalViews || null,
      followers: analyticsData.followers || null,
      engagement: analyticsData.engagement || null,
      estimatedRevenue: analyticsData.estimatedRevenue || null,
      avgWatchTime: analyticsData.avgWatchTime || null,
      commentsPerView: analyticsData.commentsPerView || null,
      sharesPerView: analyticsData.sharesPerView || null,
      dailyMetrics: analyticsData.dailyMetrics || {}
    };
    this.analytics.set(id, newAnalytics);
    return newAnalytics;
  }
  
  async updateAnalytics(id: number, data: Partial<Analytics>): Promise<Analytics | undefined> {
    const analytics = this.analytics.get(id);
    if (!analytics) return undefined;
    
    const updatedAnalytics = { ...analytics, ...data };
    this.analytics.set(id, updatedAnalytics);
    return updatedAnalytics;
  }
  
  // Content Idea operations
  async getContentIdea(id: number): Promise<ContentIdea | undefined> {
    return this.contentIdeas.get(id);
  }
  
  async getContentIdeasByUserId(userId: number): Promise<ContentIdea[]> {
    return Array.from(this.contentIdeas.values()).filter(
      (idea) => idea.userId === userId
    );
  }
  
  async createContentIdea(idea: InsertContentIdea): Promise<ContentIdea> {
    const id = this.currentContentIdeaId++;
    // Ensure all optional fields have proper null values
    const newIdea: ContentIdea = { 
      ...idea, 
      id,
      createdAt: idea.createdAt || null,
      niche: idea.niche || null,
      prompt: idea.prompt || null,
      aiGenerated: idea.aiGenerated || null,
      favorite: idea.favorite || null,
      tags: idea.tags || null
    };
    this.contentIdeas.set(id, newIdea);
    return newIdea;
  }
  
  async updateContentIdea(id: number, data: Partial<ContentIdea>): Promise<ContentIdea | undefined> {
    const idea = this.contentIdeas.get(id);
    if (!idea) return undefined;
    
    const updatedIdea = { ...idea, ...data };
    this.contentIdeas.set(id, updatedIdea);
    return updatedIdea;
  }
  
  // Content Draft operations
  async getContentDraft(id: number): Promise<ContentDraft | undefined> {
    return this.contentDrafts.get(id);
  }
  
  async getContentDraftsByUserId(userId: number): Promise<ContentDraft[]> {
    return Array.from(this.contentDrafts.values()).filter(
      (draft) => draft.userId === userId
    );
  }
  
  async getContentDraftsByIdeaId(ideaId: number): Promise<ContentDraft[]> {
    return Array.from(this.contentDrafts.values()).filter(
      (draft) => draft.ideaId === ideaId
    );
  }
  
  async createContentDraft(draft: InsertContentDraft): Promise<ContentDraft> {
    const id = this.currentContentDraftId++;
    // Ensure all optional fields have proper null values
    const newDraft: ContentDraft = { 
      ...draft, 
      id,
      status: draft.status || null,
      createdAt: draft.createdAt || null,
      ideaId: draft.ideaId || null,
      updatedAt: draft.updatedAt || null
    };
    this.contentDrafts.set(id, newDraft);
    return newDraft;
  }
  
  async updateContentDraft(id: number, data: Partial<ContentDraft>): Promise<ContentDraft | undefined> {
    const draft = this.contentDrafts.get(id);
    if (!draft) return undefined;
    
    const updatedDraft = { ...draft, ...data };
    this.contentDrafts.set(id, updatedDraft);
    return updatedDraft;
  }
  
  // Media File operations
  async getMediaFile(id: number): Promise<MediaFile | undefined> {
    return this.mediaFiles.get(id);
  }
  
  async getMediaFilesByUserId(userId: number): Promise<MediaFile[]> {
    return Array.from(this.mediaFiles.values()).filter(
      (file) => file.userId === userId
    );
  }
  
  async getMediaFilesByDraftId(draftId: number): Promise<MediaFile[]> {
    return Array.from(this.mediaFiles.values()).filter(
      (file) => file.draftId === draftId
    );
  }
  
  async createMediaFile(file: InsertMediaFile): Promise<MediaFile> {
    const id = this.currentMediaFileId++;
    // Ensure all optional fields have proper null values
    const newFile: MediaFile = { 
      ...file, 
      id,
      thumbnailUrl: file.thumbnailUrl || null,
      duration: file.duration || null,
      width: file.width || null,
      height: file.height || null,
      uploadedAt: file.uploadedAt || null,
      draftId: file.draftId || null
    };
    this.mediaFiles.set(id, newFile);
    return newFile;
  }
  
  async updateMediaFile(id: number, data: Partial<MediaFile>): Promise<MediaFile | undefined> {
    const file = this.mediaFiles.get(id);
    if (!file) return undefined;
    
    const updatedFile = { ...file, ...data };
    this.mediaFiles.set(id, updatedFile);
    return updatedFile;
  }
  
  // Initialize with demo data
  private initializeDemoData() {
    // Create a demo user with hashed password ("password" hashed using scrypt)
    const user: User = {
      id: this.currentUserId++,
      username: "demo",
      password: "7e37f68170e6ae7080c28a07686bea57cc9e8e5052d887a282d2b3985718e473fa40f0faf31f14899df2fdf7e949b56d2bc498814922745d1d85ec718993371f.9dfc3597c8c9d751f50b75b9962abd75",
      email: "demo@example.com",
      displayName: "Sarah Johnson",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "Content creator sharing tips and tricks for TikTok growth",
      tiktokHandle: "@creativesarah",
      country: "USA",
      dateOfBirth: null,
      phoneNumber: null,
      emailVerified: true,
      tiktokConnection: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      role: "creator",
      provider: "email",
      providerId: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      preferences: {
        notifications: true,
        theme: "system",
        language: "en"
      },
      socialProfiles: {
        instagram: "@sarahjcreates",
        youtube: "SarahJCreates",
        twitter: "@sarahjcreates",
        facebook: "sarahjcreates",
        tiktok: "@creativesarah"
      },
      contentCreatorInfo: {
        niche: ["lifestyle", "tech", "education"],
        brandDeals: true,
        monetized: true,
        avgViews: 50000,
        avgEngagement: 0.085,
        contentFrequency: "daily"
      }
    };
    this.users.set(user.id, user);
    
    // Create some content templates
    const contentTemplate1: ContentTemplate = {
      id: this.currentTemplateId++,
      title: "Before vs After Transformation",
      description: "4.2M views avg. • High completion rate",
      thumbnailUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      avgViews: 4200000,
      popularity: "trending",
      isNew: false
    };
    
    const contentTemplate2: ContentTemplate = {
      id: this.currentTemplateId++,
      title: "Day In My Life Transition",
      description: "2.8M views avg. • High share rate",
      thumbnailUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      avgViews: 2800000,
      popularity: "new",
      isNew: true
    };
    
    this.contentTemplates.set(contentTemplate1.id, contentTemplate1);
    this.contentTemplates.set(contentTemplate2.id, contentTemplate2);
    
    // Create some scheduled posts
    const scheduledPost1: ScheduledPost = {
      id: this.currentPostId++,
      userId: user.id,
      title: "Summer Morning Routine",
      description: "A breakdown of my productive morning routine for summer",
      content: "This is the content for the first scheduled post",
      contentDraftId: null,
      mediaFileId: null,
      thumbnailUrl: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80",
      platforms: ["tiktok"],
      scheduledFor: new Date("2025-06-08T10:00:00"),
      timeZone: "UTC",
      status: "pending",
      platformSpecificSettings: {},
      repeatSchedule: null,
      lastPublishedAt: null,
      publishResults: [],
      isOptimalTimeSelected: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const scheduledPost2: ScheduledPost = {
      id: this.currentPostId++,
      userId: user.id,
      title: "5 Tips for Better Videos",
      description: "Quick tips to improve your TikTok videos",
      content: "This is the content for the second scheduled post",
      contentDraftId: null,
      mediaFileId: null,
      thumbnailUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80",
      platforms: ["tiktok", "instagram"],
      scheduledFor: new Date("2025-06-08T16:30:00"),
      timeZone: "UTC",
      status: "pending",
      platformSpecificSettings: {},
      repeatSchedule: null,
      lastPublishedAt: null,
      publishResults: [],
      isOptimalTimeSelected: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.scheduledPosts.set(scheduledPost1.id, scheduledPost1);
    this.scheduledPosts.set(scheduledPost2.id, scheduledPost2);
    
    // Create a video and some comments
    const video: Video = {
      id: this.currentVideoId++,
      userId: user.id,
      title: "How to Edit TikTok Videos Like a Pro",
      description: "Learn my top editing secrets!",
      thumbnailUrl: "https://example.com/thumbnail.jpg",
      views: 120000,
      likes: 15000,
      comments: 3,
      shares: 5000,
      watchTime: 18.2,
      completionRate: 0.78,
      viralityScore: 78,
      createdAt: new Date(),
      hashtags: ["editing", "tiktok", "tutorial"],
      externalData: null
    };
    this.videos.set(video.id, video);
    
    const comment1: Comment = {
      id: this.currentCommentId++,
      videoId: video.id,
      username: "@danceguy44",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&h=60&q=80",
      content: "This is so helpful! Can you make one about transitions next?",
      likes: 24,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    };
    
    const comment2: Comment = {
      id: this.currentCommentId++,
      videoId: video.id,
      username: "@travelgirl",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&h=60&q=80",
      content: "Your lighting is amazing! What setup do you use?",
      likes: 18,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    };
    
    const comment3: Comment = {
      id: this.currentCommentId++,
      videoId: video.id,
      username: "@tech_james",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&h=60&q=80",
      content: "Great content as always! Keep it up 👏",
      likes: 42,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    };
    
    this.comments.set(comment1.id, comment1);
    this.comments.set(comment2.id, comment2);
    this.comments.set(comment3.id, comment3);
    
    // Create some revenue data
    const revenue1: Revenue = {
      id: this.currentRevenueId++,
      userId: user.id,
      amount: 1458,
      source: "creator_fund",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
    };
    
    const revenue2: Revenue = {
      id: this.currentRevenueId++,
      userId: user.id,
      amount: 972,
      source: "brand_deals",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
    };
    
    const revenue3: Revenue = {
      id: this.currentRevenueId++,
      userId: user.id,
      amount: 810,
      source: "affiliate",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
    };
    
    this.revenues.set(revenue1.id, revenue1);
    this.revenues.set(revenue2.id, revenue2);
    this.revenues.set(revenue3.id, revenue3);
    
    // Create analytics data
    const analytics: Analytics = {
      id: this.currentAnalyticsId++,
      userId: user.id,
      date: new Date(),
      totalViews: 1200000,
      followers: 85400,
      engagement: 6.8,
      estimatedRevenue: 3240,
      avgWatchTime: 18.2,
      commentsPerView: 2.4,
      sharesPerView: 3.8,
      dailyMetrics: {
        mon: 30,
        tue: 45,
        wed: 80,
        thu: 60,
        fri: 75,
        sat: 90,
        sun: 50
      }
    };
    
    this.analytics.set(analytics.id, analytics);
    
    // Create some demo content ideas
    const contentIdea1: ContentIdea = {
      id: this.currentContentIdeaId++,
      userId: user.id,
      title: "Morning Routine Step-by-Step",
      description: "A detailed breakdown of a productive morning routine with tips for optimal energy.",
      hashtags: "#morning #routine #productivity",
      niche: "Productivity",
      prompt: "Create a morning routine video with step-by-step instructions",
      keyPoints: "Wake early, hydrate, exercise, journal, breakfast",
      estimatedEngagement: 4.8,
      platform: "tiktok",
      status: "ready",
      aiGenerated: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      favorite: true,
      tags: ["morning-routine", "productivity", "wellness"]
    };
    
    const contentIdea2: ContentIdea = {
      id: this.currentContentIdeaId++,
      userId: user.id,
      title: "5 Hidden TikTok Features",
      description: "Showcase lesser-known TikTok features that can help creators stand out.",
      hashtags: "#tiktok #tips #features",
      niche: "Social Media",
      prompt: "What are some hidden TikTok features most people don't know about?",
      keyPoints: "Analytics, sound mixing, caption tricks, scheduling, trending topics",
      estimatedEngagement: 5.2,
      platform: "tiktok",
      status: "draft",
      aiGenerated: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      favorite: false,
      tags: ["tiktok", "tips", "social-media"]
    };
    
    this.contentIdeas.set(contentIdea1.id, contentIdea1);
    this.contentIdeas.set(contentIdea2.id, contentIdea2);
    
    // Create some demo content drafts
    const contentDraft1: ContentDraft = {
      id: this.currentContentDraftId++,
      userId: user.id,
      ideaId: contentIdea1.id,
      title: "My Productive Morning Routine 2025",
      content: "# Morning Routine Script\n\n## Intro\nHey everyone! Today I'm showing you my morning routine that changed my productivity forever.\n\n## Segment 1: Wake Up (5:30 AM)\n*Show alarm ringing and getting out of bed*\nVoiceover: \"The key is to get up immediately when the alarm goes off!\"\n\n## Segment 2: Hydration\n*Show drinking water from bedside table*\nVoiceover: \"First thing - hydrate! Your body is dehydrated after 8 hours of sleep.\"\n\n## Segment 3: Stretching\n*Quick montage of simple stretches*\n\n## Segment 4: Meditation (10 mins)\n*Sitting peacefully in meditation spot*\n\n## Segment 5: Journaling\n*Writing in journal*\nVoiceover: \"I write three things I'm grateful for every morning.\"\n\n## Segment 6: Breakfast\n*Preparing healthy breakfast*\n\n## Conclusion\nVoiceover: \"This routine has transformed my energy levels and productivity! Try it for a week and see the difference.\"",
      platform: "tiktok",
      hook: "Want to 10x your productivity? My morning routine changed EVERYTHING.",
      structure: "Intro > Wake up > Hydrate > Stretch > Meditate > Journal > Breakfast > Conclusion",
      audioSuggestions: "Upbeat morning music, calm meditation background",
      visualEffects: "Sunrise transitions, text overlays for key points",
      callToAction: "Try this routine for a week and comment your results below!",
      status: "in-progress",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    };
    
    const contentDraft2: ContentDraft = {
      id: this.currentContentDraftId++,
      userId: user.id,
      ideaId: contentIdea2.id,
      title: "5 TikTok Features You're Not Using (But Should Be!)",
      content: "# Hidden TikTok Features Script\n\n## Intro\n\"You're missing out on these 5 powerful TikTok features! Let me show you how to use them...\"\n\n## Feature 1: Advanced Analytics\n*Show screen recording of navigating to hidden analytics page*\nVoiceover: \"Did you know you can see exactly when your followers are most active? Here's how...\"\n\n## Feature 2: Content Calendar\n*Screen recording of calendar feature*\n\n## Feature 3: Sound Mixing\n*Demonstrate advanced audio editing*\n\n## Feature 4: Keyword Research Tool\n*Show how to find trending keywords*\n\n## Feature 5: Caption Formatting Tricks\n*Demonstrate little-known formatting options*\n\n## Conclusion\n\"Which of these features will you try first? Let me know in the comments!\"",
      platform: "tiktok",
      hook: "99% of TikTokers don't know these 5 game-changing features!",
      structure: "Hook > Feature 1 > Feature 2 > Feature 3 > Feature 4 > Feature 5 > CTA",
      audioSuggestions: "Trending sound with \"mind blown\" effect at each reveal",
      visualEffects: "Screen recording overlays, zoom effects, finger pointing animations",
      callToAction: "Comment which feature you'll try first! Follow for more TikTok tips.",
      status: "draft",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    };
    
    this.contentDrafts.set(contentDraft1.id, contentDraft1);
    this.contentDrafts.set(contentDraft2.id, contentDraft2);
    
    // Create some demo media files
    const mediaFile1: MediaFile = {
      id: this.currentMediaFileId++,
      userId: user.id,
      draftId: contentDraft1.id,
      filename: "morning_routine_intro.mp4",
      fileType: "video",
      fileSize: 8240000,
      fileUrl: "https://example.com/media/morning_routine_intro.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
      duration: 15.4,
      width: 1080,
      height: 1920,
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    };
    
    const mediaFile2: MediaFile = {
      id: this.currentMediaFileId++,
      userId: user.id,
      draftId: contentDraft1.id,
      filename: "morning_stretching.mp4",
      fileType: "video",
      fileSize: 12480000,
      fileUrl: "https://example.com/media/morning_stretching.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1599058917817-4628db257274?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
      duration: 22.8,
      width: 1080,
      height: 1920,
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    };
    
    const mediaFile3: MediaFile = {
      id: this.currentMediaFileId++,
      userId: user.id,
      draftId: contentDraft2.id,
      filename: "tiktok_features_thumbnail.jpg",
      fileType: "image",
      fileSize: 1240000,
      fileUrl: "https://example.com/media/tiktok_features_thumbnail.jpg",
      thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
      duration: null, // null for image files
      width: 1080,
      height: 1920,
      uploadedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    };
    
    this.mediaFiles.set(mediaFile1.id, mediaFile1);
    this.mediaFiles.set(mediaFile2.id, mediaFile2);
    this.mediaFiles.set(mediaFile3.id, mediaFile3);
  }
}

export const storage = new MemStorage();
