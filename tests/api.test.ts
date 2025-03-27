import express, { Express } from 'express';
import request from 'supertest';
import { Server } from 'http';
import { registerRoutes } from '../server/routes';
import { expect, describe, it, beforeAll, afterAll } from '@jest/globals';

describe('API Tests', () => {
  let app: Express;
  let server: Server;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('User API', () => {
    it('should get a user by ID', async () => {
      const response = await request(app)
        .get('/api/users/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('username', 'demo');
      expect(response.body).toHaveProperty('displayName', 'Sarah Johnson');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/999');
      
      expect(response.status).toBe(404);
    });

    it('should create a new user', async () => {
      const newUser = {
        username: 'apitest',
        displayName: 'API Test User',
        password: 'password123',
        handle: '@apitest',
        avatar: null
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username', 'apitest');
      expect(response.body).toHaveProperty('displayName', 'API Test User');
      expect(response.body).toHaveProperty('handle', '@apitest');
    });

    it('should return 400 for invalid user data', async () => {
      const invalidUser = {
        username: '',
        displayName: '',
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(invalidUser);
      
      expect(response.status).toBe(400);
    });
  });

  describe('Video API', () => {
    it('should get a video by ID', async () => {
      const response = await request(app)
        .get('/api/videos/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toBe(1);
      expect(response.body.title).toBe('How I Grew My TikTok to 1M Followers');
      expect(response.body.userId).toBeGreaterThan(0);
    });

    it('should get videos for a user', async () => {
      const response = await request(app)
        .get('/api/users/1/videos');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('length');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('userId', 1);
    });

    it('should return 404 for non-existent video', async () => {
      const response = await request(app)
        .get('/api/videos/999');
      
      expect(response.status).toBe(404);
    });
  });

  describe('Content Template API', () => {
    it('should get all content templates', async () => {
      const response = await request(app)
        .get('/api/content-templates');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
    });

    it('should get a content template by ID', async () => {
      const response = await request(app)
        .get('/api/content-templates/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title');
    });

    it('should create a new content template', async () => {
      const newTemplate = {
        title: 'API Test Template',
        description: 'Template created from API test',
        thumbnailUrl: null,
        avgViews: null,
        popularity: 'high',
        isNew: true
      };
      
      const response = await request(app)
        .post('/api/content-templates')
        .send(newTemplate);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'API Test Template');
      expect(response.body).toHaveProperty('description', 'Template created from API test');
      expect(response.body).toHaveProperty('popularity', 'high');
      expect(response.body.isNew).toBe(true);
      expect(response.body.thumbnailUrl).toContain(null);
    });

    it('should return 400 for invalid template data', async () => {
      const invalidTemplate = {
        title: '',
      };
      
      const response = await request(app)
        .post('/api/content-templates')
        .send(invalidTemplate);
      
      expect(response.status).toBe(400);
      expect(response.body).toBe('description is required');
      expect(response.body).toBeGreaterThan(0);
      expect(response.body.message).toBe('Validation error');
    });

    it('should return 404 for non-existent template', async () => {
      const response = await request(app)
        .get('/api/content-templates/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Content Ideas API', () => {
    it('should get all content ideas for a user', async () => {
      const response = await request(app)
        .get('/api/users/1/content-ideas');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('userId', 1);
      expect(response.body[0]).toHaveProperty('description');
      
      expect(response.body[0]).toHaveProperty('tags');
    });

    it('should create a new content idea', async () => {
      const newIdea = {
        title: 'API Test Idea',
        userId: 1,
        description: 'Content idea created from API test',
        createdAt: new Date().toISOString(),
        niche: 'tech',
        prompt: 'Testing API endpoints',
        aiGenerated: true,
        favorite: false,
        tags: ['test', 'api']
      };
      
      const response = await request(app)
        .post('/api/content-ideas')
        .send(newIdea);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'API Test Idea');
      expect(response.body).toHaveProperty('userId', 1);
      expect(response.body).toHaveProperty('description', 'Content idea created from API test');
      expect(response.body).toHaveProperty('niche', 'tech');
    });

    it('should update a content idea', async () => {
      const updateData = {
        favorite: true,
        tags: ['updated', 'tags']
      };
      
      const response = await request(app)
        .patch('/api/content-ideas/1')
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toBe(true);
      expect(response.body.id).toBe(1);
      expect(response.body.favorite).toBe(true);
      expect(response.body.tags).toBeGreaterThan(0);
      expect(response.body.tags[0]).toBe('updated');
    });

    it('should get a content idea by ID', async () => {
      const response = await request(app)
        .get('/api/content-ideas/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toBe(1);
      expect(response.body.tags).toBeGreaterThan(0);
      expect(response.body.userId).toBe(1);
    });

    it('should return 404 for non-existent idea', async () => {
      const response = await request(app)
        .get('/api/content-ideas/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Content Drafts API', () => {
    it('should get all content drafts for a user', async () => {
      const response = await request(app)
        .get('/api/users/1/content-drafts');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('userId', 1);
    });

    it('should create a new content draft', async () => {
      const newDraft = {
        title: 'API Test Draft',
        content: 'Draft content created from API test',
        userId: 1,
        ideaId: 1,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const response = await request(app)
        .post('/api/content-drafts')
        .send(newDraft);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'API Test Draft');
      expect(response.body).toHaveProperty('userId', 1);
      expect(response.body).toHaveProperty('content', 'Draft content created from API test');
      expect(response.body).toContain('draft');
    });
  });
});