import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  handle: text("handle").notNull().unique(),
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
});

// Content Template model
export const contentTemplates = pgTable("content_templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  avgViews: integer("avg_views").default(0),
  popularity: text("popularity").default("normal"),
  isNew: boolean("is_new").default(false),
});

// Scheduled Post model
export const scheduledPosts = pgTable("scheduled_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  platforms: text("platforms").array(),
  scheduledFor: timestamp("scheduled_for").notNull(),
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

// Insert schemas for all models
export const insertUserSchema = createInsertSchema(users);
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true });
export const insertContentTemplateSchema = createInsertSchema(contentTemplates).omit({ id: true });
export const insertScheduledPostSchema = createInsertSchema(scheduledPosts).omit({ id: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true });
export const insertRevenueSchema = createInsertSchema(revenue).omit({ id: true });
export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true });

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
