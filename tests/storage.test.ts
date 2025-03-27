import { storage } from '../server/storage';
import { expect, describe, it, beforeAll } from '@jest/globals';

describe('Storage Tests', () => {
  describe('User Operations', () => {
    it('should create a user', async () => {
      const user = await storage.createUser({
        username: 'testuser',
        displayName: 'Test User',
        password: 'password123',
        handle: '@testuser',
        avatar: null
      });
      expect(user).toBeTruthy();
      expect(user.username).toBe('testuser');
      expect(user.displayName).toBe('Test User');
    });

    it('should get a user by id', async () => {
      const user = await storage.getUser(1);
      expect(user).toBeTruthy();
      expect(user?.username).toBe('demo');
    });

    it('should get a user by username', async () => {
      const user = await storage.getUserByUsername('demo');
      expect(user).toBeTruthy();
      expect(user?.id).toBe(1);
      expect(user?.displayName).toBe('Sarah Johnson');
      expect(user?.handle).toBeGreaterThan(0);
    });
  });

  describe('Video Operations', () => {
    it('should create a video', async () => {
      const video = await storage.createVideo({
        title: 'Test Video',
        userId: 1,
        description: 'This is a test video',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        duration: 120,
        uploadDate: new Date(),
        hashtags: ['test', 'video']
      });
      
      expect(video).toBeTruthy();
      expect(video.title).toBe('Test Video');
      expect(video.userId).toBe(1);
      expect(video.hashtags).toContain('test');
    });

    it('should get videos by user id', async () => {
      const videos = await storage.getVideosByUserId(1);
      expect(videos).toBeTruthy();
      expect(videos.length).toBeGreaterThan(0);
      expect(videos[0].userId).toBe(1);
    });

    it('should get a video by id', async () => {
      const video = await storage.getVideo(1);
      expect(video).toBeTruthy();
      expect(video?.title).toBe('How I Grew My TikTok to 1M Followers');
      expect(video?.userId).toBe(1);
    });

    it('should update video stats', async () => {
      const video = await storage.updateVideoStats(1, {
        views: 1000,
        likes: 500,
        shares: 100,
        comments: 50
      });
      
      expect(video).toBeTruthy();
      expect(video?.views).toBe(1000);
      expect(video?.likes).toBe(500);
      expect(video?.shares).toBe(100);
      expect(video?.comments).toBe(50);
    });
  });

  describe('Content Template Operations', () => {
    it('should create a content template', async () => {
      const template = await storage.createContentTemplate({
        title: 'Test Template',
        description: 'This is a test template',
        thumbnailUrl: null,
        avgViews: null,
        popularity: null,
        isNew: true
      });
      
      expect(template).toBeTruthy();
      expect(template.title).toBe('Test Template');
      expect(template.description).toBe('This is a test template');
      expect(template.isNew).toBe(true);
    });

    it('should get all content templates', async () => {
      const templates = await storage.getContentTemplates();
      expect(templates).toBeTruthy();
      expect(templates.length).toBeGreaterThan(0);
      expect(templates[0].title).toBe('Day in the Life');
    });

    it('should get a template by id', async () => {
      const template = await storage.getContentTemplate(1);
      expect(template).toBeTruthy();
      expect(template?.title).toBe('Day in the Life');
      expect(template?.description).toBe('Share your daily routine with followers');
    });
  });

  describe('Scheduled Post Operations', () => {
    it('should create a scheduled post', async () => {
      const post = await storage.createScheduledPost({
        title: 'Test Post',
        userId: 1,
        scheduledFor: new Date(),
        thumbnailUrl: null,
        platforms: ['tiktok', 'instagram']
      });
      
      expect(post).toBeTruthy();
      expect(post.title).toBe('Test Post');
      expect(post.userId).toBe(1);
      expect(post.platforms).toContain('tiktok');
    });

    it('should get scheduled posts by user id', async () => {
      const posts = await storage.getScheduledPostsByUserId(1);
      expect(posts).toBeTruthy();
      expect(posts.length).toBeGreaterThan(0);
      expect(posts[0].userId).toBe(1);
    });
  });

  describe('Content Idea Operations', () => {
    it('should create a content idea', async () => {
      const idea = await storage.createContentIdea({
        title: 'Test Idea',
        userId: 1,
        description: 'This is a test idea',
        createdAt: new Date(),
        niche: 'tech',
        prompt: 'How to test an app',
        aiGenerated: true,
        favorite: false,
        tags: ['tech', 'testing']
      });
      
      expect(idea).toBeTruthy();
      expect(idea.title).toBe('Test Idea');
      expect(idea.userId).toBe(1);
      expect(idea.description).toBe('This is a test idea');
      expect(idea.aiGenerated).toBe(true);
    });

    it('should get content ideas by user id', async () => {
      const ideas = await storage.getContentIdeasByUserId(1);
      expect(ideas).toBeTruthy();
      expect(ideas.length).toBeGreaterThan(0);
      expect(ideas[0].userId).toBe(1);
    });

    it('should update a content idea', async () => {
      const updatedIdea = await storage.updateContentIdea(1, {
        favorite: true,
        tags: ['updated', 'tags']
      });
      
      expect(updatedIdea).toBeTruthy();
      expect(updatedIdea?.favorite).toBe(true);
      expect(updatedIdea?.tags).toContain('updated');
    });
  });

  describe('Content Draft Operations', () => {
    it('should create a content draft', async () => {
      const draft = await storage.createContentDraft({
        title: 'Test Draft',
        content: 'This is a test draft content',
        userId: 1,
        ideaId: 1,
        status: 'in-progress',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      expect(draft).toBeTruthy();
      expect(draft.title).toBe('Test Draft');
      expect(draft.userId).toBe(1);
      expect(draft.content).toBe('This is a test draft content');
      expect(draft.status).toBe('in-progress');
    });

    it('should get content drafts by user id', async () => {
      const drafts = await storage.getContentDraftsByUserId(1);
      expect(drafts).toBeTruthy();
      expect(drafts.length).toBeGreaterThan(0);
      expect(drafts[0].userId).toBe(1);
    });

    it('should get content drafts by idea id', async () => {
      const drafts = await storage.getContentDraftsByIdeaId(1);
      expect(drafts).toBeTruthy();
      expect(drafts.length).toBeGreaterThan(0);
      expect(drafts[0].ideaId).toBe(1);
    });

    it('should update a content draft', async () => {
      const updatedDraft = await storage.updateContentDraft(1, {
        title: 'Updated Draft Title',
        status: 'completed',
        updatedAt: new Date()
      });
      
      expect(updatedDraft).toBeTruthy();
      expect(updatedDraft?.title).toBe('Updated Draft Title');
      expect(updatedDraft?.status).toBe('completed');
    });
  });

  describe('Media File Operations', () => {
    it('should create a media file', async () => {
      const mediaFile = await storage.createMediaFile({
        userId: 1,
        filename: 'test-file.mp4',
        fileType: 'video/mp4',
        fileSize: 1024000,
        fileUrl: 'https://example.com/test-file.mp4',
        draftId: 1,
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        duration: 120,
        width: 1920,
        height: 1080,
        uploadedAt: new Date()
      });
      
      expect(mediaFile).toBeTruthy();
      expect(mediaFile.filename).toBe('test-file.mp4');
      expect(mediaFile.userId).toBe(1);
      expect(mediaFile.fileType).toBe('video/mp4');
      expect(mediaFile.draftId).toBe(1);
    });

    it('should get media files by user id', async () => {
      const files = await storage.getMediaFilesByUserId(1);
      expect(files).toBeTruthy();
      expect(files.length).toBeGreaterThan(0);
      expect(files[0].userId).toBe(1);
    });

    it('should get media files by draft id', async () => {
      const files = await storage.getMediaFilesByDraftId(1);
      expect(files).toBeTruthy();
      expect(files.length).toBeGreaterThan(0);
      expect(files[0].draftId).toBe(1);
    });

    it('should update a media file', async () => {
      const updatedFile = await storage.updateMediaFile(1, {
        fileSize: 2048000,
        duration: 240
      });
      
      expect(updatedFile).toBeTruthy();
      expect(updatedFile?.fileSize).toBe(2048000);
      expect(updatedFile?.duration).toBe(240);
    });
  });
});