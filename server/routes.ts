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
  insertAnalyticsSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  const apiRouter = app.route('/api');
  
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
  
  // Simple authentication route for demo purposes
  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  const httpServer = createServer(app);
  return httpServer;
}
