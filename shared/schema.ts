import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").default("user").notNull(), // user, creator, admin
  provider: text("provider").default("email").notNull(), // email, google, twitter, tiktok
  providerId: text("provider_id"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  tiktokHandle: text("tiktok_handle"),
  country: text("country"),
  dateOfBirth: timestamp("date_of_birth"),
  phoneNumber: text("phone_number"),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
  preferences: jsonb("preferences").default({
    notifications: true,
    theme: "system",
    language: "en"
  }),
  socialProfiles: jsonb("social_profiles").default({
    tiktok: null
  }),
  contentCreatorInfo: jsonb("content_creator_info").default({
    niche: [],
    brandDeals: false,
    monetized: false,
    avgViews: null,
    avgEngagement: null,
    contentFrequency: null
  }),
  tiktokConnection: jsonb("tiktok_connection"),
});

// Video model
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  watchTime: real("watch_time").default(0),
  completionRate: real("completion_rate").default(0),
  viralityScore: integer("virality_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  hashtags: text("hashtags").array(),
  externalData: jsonb("external_data"),
});

// Content Template model
export const contentTemplates = pgTable("content_templates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  avgViews: integer("avg_views").default(0),
  popularity: text("popularity").default("normal"),
  isNew: boolean("is_new").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scheduled Post model
export const scheduledPosts = pgTable("scheduled_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  contentDraftId: integer("content_draft_id").references(() => contentDrafts.id),
  mediaFileId: integer("media_file_id").references(() => mediaFiles.id),
  thumbnailUrl: text("thumbnail_url"),
  platforms: text("platforms").array().default(["tiktok"]),
  scheduledFor: timestamp("scheduled_for").notNull(),
  timeZone: text("time_zone").default("UTC"),
  status: text("status").default("pending"), // pending, published, failed
  platformSpecificSettings: jsonb("platform_specific_settings").default({}),
  repeatSchedule: text("repeat_schedule"), // none, daily, weekly, monthly
  lastPublishedAt: timestamp("last_published_at"),
  publishResults: jsonb("publish_results").default([]),
  isOptimalTimeSelected: boolean("is_optimal_time_selected").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comment model
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull().references(() => videos.id),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url"),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Revenue model
export const revenue = pgTable("revenue", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: real("amount").notNull(),
  source: text("source").notNull(),
  date: timestamp("date").defaultNow(),
});

// Analytics model
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  totalViews: integer("total_views").default(0),
  followers: integer("followers").default(0),
  engagement: real("engagement").default(0),
  estimatedRevenue: real("estimated_revenue").default(0),
  avgWatchTime: real("avg_watch_time").default(0),
  commentsPerView: real("comments_per_view").default(0),
  sharesPerView: real("shares_per_view").default(0),
  dailyMetrics: jsonb("daily_metrics"),
});

// Content Ideas model (for AI-generated ideas)
export const contentIdeas = pgTable("content_ideas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  niche: text("niche"),
  prompt: text("prompt"),
  keyPoints: text("key_points"),
  hashtags: text("hashtags"),
  estimatedEngagement: real("estimated_engagement"),
  platform: text("platform").default("tiktok"),
  status: text("status").default("draft"), // draft, in-progress, ready, published
  aiGenerated: boolean("ai_generated").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  favorite: boolean("favorite").default(false),
  tags: text("tags").array(),
});

// Content Drafts model (for scripts, drafts, etc.)
export const contentDrafts = pgTable("content_drafts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  ideaId: integer("idea_id").references(() => contentIdeas.id),
  hook: text("hook"),
  structure: text("structure"), // JSON string with timing and sections
  audioSuggestions: text("audio_suggestions"),
  visualEffects: text("visual_effects"),
  callToAction: text("call_to_action"),
  platform: text("platform").default("tiktok"),
  status: text("status").default("draft"), // draft, in-progress, ready, published
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media Files model (for uploaded videos, images, etc.)
export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  filename: text("filename").notNull(),
  fileType: text("file_type").notNull(), // video, image, audio
  fileSize: integer("file_size").notNull(),
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  duration: real("duration"), // For videos/audio
  width: integer("width"), // For images/videos
  height: integer("height"), // For images/videos
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  draftId: integer("draft_id").references(() => contentDrafts.id),
});

// Insert schemas for all models
export const insertUserSchema = createInsertSchema(users);
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true });
export const insertContentTemplateSchema = createInsertSchema(contentTemplates).omit({ id: true });
export const insertScheduledPostSchema = createInsertSchema(scheduledPosts).omit({ id: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true });
export const insertRevenueSchema = createInsertSchema(revenue).omit({ id: true });
export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true });
export const insertContentIdeaSchema = createInsertSchema(contentIdeas).omit({ id: true });
export const insertContentDraftSchema = createInsertSchema(contentDrafts).omit({ id: true });
export const insertMediaFileSchema = createInsertSchema(mediaFiles).omit({ id: true });

// Types for all models
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertContentTemplate = z.infer<typeof insertContentTemplateSchema>;
export type ContentTemplate = typeof contentTemplates.$inferSelect;

export type InsertScheduledPost = z.infer<typeof insertScheduledPostSchema>;
export type ScheduledPost = typeof scheduledPosts.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertRevenue = z.infer<typeof insertRevenueSchema>;
export type Revenue = typeof revenue.$inferSelect;

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

export type InsertContentIdea = z.infer<typeof insertContentIdeaSchema>;
export type ContentIdea = typeof contentIdeas.$inferSelect;

export type InsertContentDraft = z.infer<typeof insertContentDraftSchema>;
export type ContentDraft = typeof contentDrafts.$inferSelect;

export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;
export type MediaFile = typeof mediaFiles.$inferSelect;
