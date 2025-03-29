import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertVideoSchema, 
  insertContentTemplateSchema, 
  insertScheduledPostSchema, 
  insertCommentSchema, 
  insertRevenueSchema, 
  insertAnalyticsSchema,
  insertContentIdeaSchema,
  insertContentDraftSchema,
  insertMediaFileSchema
} from "@shared/schema";
import authRoutes from "./routes/auth.routes";
import aiRoutes from "./routes/ai.routes";
import schedulerRoutes from "./routes/scheduler.routes";
import tiktokRoutes from "./routes/tiktok.routes";
import { setupAuth } from "./auth";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Set up route middleware
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/scheduler', schedulerRoutes);
  app.use('/api/tiktok', tiktokRoutes);
  
  // User routes
  app.get('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    const user = await storage.getUser(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Don't return the password in the response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.post('/api/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create user' });
    }
  });
  
  // Update user
  app.patch('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    // Check if user exists
    const user = await storage.getUser(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    try {
      // Add updateUser method to the storage
      const updatedUser = await storage.updateUser(id, req.body);
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update user' });
    }
  });
  
  // Video routes
  app.get('/api/videos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    const video = await storage.getVideo(id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    
    res.json(video);
  });
  
  app.get('/api/users/:userId/videos', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID format' });
    
    const videos = await storage.getVideosByUserId(userId);
    res.json(videos);
  });
  
  app.post('/api/videos', async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(videoData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid video data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create video' });
    }
  });
  
  // Content Template routes
  app.get('/api/content-templates', async (req, res) => {
    const templates = await storage.getContentTemplates();
    res.json(templates);
  });
  
  app.get('/api/content-templates/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    const template = await storage.getContentTemplate(id);
    if (!template) return res.status(404).json({ message: 'Content template not found' });
    
    res.json(template);
  });
  
  app.post('/api/content-templates', async (req, res) => {
    try {
      const templateData = insertContentTemplateSchema.parse(req.body);
      const template = await storage.createContentTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid content template data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create content template' });
    }
  });
  
  // Scheduled Post routes
  app.get('/api/users/:userId/scheduled-posts', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID format' });
    
    const posts = await storage.getScheduledPostsByUserId(userId);
    res.json(posts);
  });
  
  app.post('/api/scheduled-posts', async (req, res) => {
    try {
      const postData = insertScheduledPostSchema.parse(req.body);
      const post = await storage.createScheduledPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid scheduled post data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create scheduled post' });
    }
  });
  
  // Comment routes
  app.get('/api/videos/:videoId/comments', async (req, res) => {
    const videoId = parseInt(req.params.videoId);
    if (isNaN(videoId)) return res.status(400).json({ message: 'Invalid video ID format' });
    
    const comments = await storage.getCommentsByVideoId(videoId);
    res.json(comments);
  });
  
  app.post('/api/comments', async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid comment data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create comment' });
    }
  });
  
  // Revenue routes
  app.get('/api/users/:userId/revenue', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID format' });
    
    let revenues;
    if (req.query.startDate && req.query.endDate) {
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      
      revenues = await storage.getRevenueByUserIdAndPeriod(userId, startDate, endDate);
    } else {
      revenues = await storage.getRevenueByUserId(userId);
    }
    
    res.json(revenues);
  });
  
  // Analytics routes
  app.get('/api/users/:userId/analytics', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID format' });
    
    const analytics = await storage.getLatestAnalyticsByUserId(userId);
    if (!analytics) return res.status(404).json({ message: 'Analytics not found' });
    
    res.json(analytics);
  });
  
  // Content Ideas routes
  app.get('/api/content-ideas/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    const idea = await storage.getContentIdea(id);
    if (!idea) return res.status(404).json({ message: 'Content idea not found' });
    
    res.json(idea);
  });
  
  app.get('/api/users/:userId/content-ideas', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID format' });
    
    const ideas = await storage.getContentIdeasByUserId(userId);
    res.json(ideas);
  });
  
  app.post('/api/content-ideas', async (req, res) => {
    try {
      const ideaData = insertContentIdeaSchema.parse(req.body);
      const idea = await storage.createContentIdea(ideaData);
      res.status(201).json(idea);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid content idea data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create content idea' });
    }
  });
  
  app.patch('/api/content-ideas/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    try {
      const updatedIdea = await storage.updateContentIdea(id, req.body);
      if (!updatedIdea) return res.status(404).json({ message: 'Content idea not found' });
      
      res.json(updatedIdea);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update content idea' });
    }
  });
  
  app.delete('/api/content-ideas/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    try {
      // In a real application, we would delete the idea from the database
      // For our in-memory storage, we'll just return success
      // TODO: Add deleteContentIdea method to the storage interface
      const idea = await storage.getContentIdea(id);
      if (!idea) return res.status(404).json({ message: 'Content idea not found' });
      
      // Return success
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete content idea' });
    }
  });
  
  // Content Drafts routes
  app.get('/api/content-drafts/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    const draft = await storage.getContentDraft(id);
    if (!draft) return res.status(404).json({ message: 'Content draft not found' });
    
    res.json(draft);
  });
  
  app.get('/api/users/:userId/content-drafts', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID format' });
    
    const drafts = await storage.getContentDraftsByUserId(userId);
    res.json(drafts);
  });
  
  app.get('/api/content-ideas/:ideaId/drafts', async (req, res) => {
    const ideaId = parseInt(req.params.ideaId);
    if (isNaN(ideaId)) return res.status(400).json({ message: 'Invalid idea ID format' });
    
    const drafts = await storage.getContentDraftsByIdeaId(ideaId);
    res.json(drafts);
  });
  
  app.post('/api/content-drafts', async (req, res) => {
    try {
      const draftData = insertContentDraftSchema.parse(req.body);
      const draft = await storage.createContentDraft(draftData);
      res.status(201).json(draft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid content draft data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create content draft' });
    }
  });
  
  app.patch('/api/content-drafts/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    try {
      const updatedDraft = await storage.updateContentDraft(id, req.body);
      if (!updatedDraft) return res.status(404).json({ message: 'Content draft not found' });
      
      res.json(updatedDraft);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update content draft' });
    }
  });
  
  app.delete('/api/content-drafts/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    try {
      // In a real application, we would delete the draft from the database
      // For our in-memory storage, we'll just return success
      // TODO: Add deleteContentDraft method to the storage interface
      const draft = await storage.getContentDraft(id);
      if (!draft) return res.status(404).json({ message: 'Content draft not found' });
      
      // Return success
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete content draft' });
    }
  });
  
  // Media Files routes
  app.get('/api/media-files/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    const file = await storage.getMediaFile(id);
    if (!file) return res.status(404).json({ message: 'Media file not found' });
    
    res.json(file);
  });
  
  app.get('/api/users/:userId/media-files', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID format' });
    
    const files = await storage.getMediaFilesByUserId(userId);
    res.json(files);
  });
  
  app.get('/api/content-drafts/:draftId/media-files', async (req, res) => {
    const draftId = parseInt(req.params.draftId);
    if (isNaN(draftId)) return res.status(400).json({ message: 'Invalid draft ID format' });
    
    const files = await storage.getMediaFilesByDraftId(draftId);
    res.json(files);
  });
  
  app.post('/api/media-files', async (req, res) => {
    try {
      const fileData = insertMediaFileSchema.parse(req.body);
      const file = await storage.createMediaFile(fileData);
      res.status(201).json(file);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid media file data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create media file' });
    }
  });
  
  app.patch('/api/media-files/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    try {
      const updatedFile = await storage.updateMediaFile(id, req.body);
      if (!updatedFile) return res.status(404).json({ message: 'Media file not found' });
      
      res.json(updatedFile);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update media file' });
    }
  });
  
  // Advanced authentication routes are now handled by the /api/auth router

  const httpServer = createServer(app);
  return httpServer;
}
