import {
  User, InsertUser,
  Video, InsertVideo,
  ContentTemplate, InsertContentTemplate,
  ScheduledPost, InsertScheduledPost,
  Comment, InsertComment,
  Revenue, InsertRevenue,
  Analytics, InsertAnalytics
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private videos: Map<number, Video>;
  private contentTemplates: Map<number, ContentTemplate>;
  private scheduledPosts: Map<number, ScheduledPost>;
  private comments: Map<number, Comment>;
  private revenues: Map<number, Revenue>;
  private analytics: Map<number, Analytics>;
  
  private currentUserId: number;
  private currentVideoId: number;
  private currentTemplateId: number;
  private currentPostId: number;
  private currentCommentId: number;
  private currentRevenueId: number;
  private currentAnalyticsId: number;

  constructor() {
    this.users = new Map();
    this.videos = new Map();
    this.contentTemplates = new Map();
    this.scheduledPosts = new Map();
    this.comments = new Map();
    this.revenues = new Map();
    this.analytics = new Map();
    
    this.currentUserId = 1;
    this.currentVideoId = 1;
    this.currentTemplateId = 1;
    this.currentPostId = 1;
    this.currentCommentId = 1;
    this.currentRevenueId = 1;
    this.currentAnalyticsId = 1;
    
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
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
    const newVideo: Video = { ...video, id };
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
    const newTemplate: ContentTemplate = { ...template, id };
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
    const newPost: ScheduledPost = { ...post, id };
    this.scheduledPosts.set(id, newPost);
    return newPost;
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
    const newComment: Comment = { ...comment, id };
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
        revenue.date >= startDate && 
        revenue.date <= endDate
    );
  }
  
  async createRevenue(revData: InsertRevenue): Promise<Revenue> {
    const id = this.currentRevenueId++;
    const newRevenue: Revenue = { ...revData, id };
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
    
    // Return the latest analytics entry
    return userAnalytics.reduce((latest, current) => 
      latest.date > current.date ? latest : current
    );
  }
  
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    const newAnalytics: Analytics = { ...analyticsData, id };
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
  
  // Initialize with demo data
  private initializeDemoData() {
    // Create a demo user
    const user: User = {
      id: this.currentUserId++,
      username: "demo",
      password: "password",
      displayName: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      handle: "@creativesarah"
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
      thumbnailUrl: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80",
      platforms: ["tiktok"],
      scheduledFor: new Date("2023-06-08T10:00:00")
    };
    
    const scheduledPost2: ScheduledPost = {
      id: this.currentPostId++,
      userId: user.id,
      title: "5 Tips for Better Videos",
      thumbnailUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80",
      platforms: ["tiktok", "instagram"],
      scheduledFor: new Date("2023-06-08T16:30:00")
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
      hashtags: ["editing", "tiktok", "tutorial"]
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
  }
}

export const storage = new MemStorage();
