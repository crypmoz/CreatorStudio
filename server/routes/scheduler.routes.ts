import { Router, Request, Response, NextFunction } from 'express';
import { schedulerService } from '../services/scheduler.service';
import { authenticate } from '../middleware/auth.middleware';
import { insertScheduledPostSchema } from '@shared/schema';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

const router = Router();

/**
 * @route GET /api/scheduler/posts
 * @desc Get all scheduled posts for the current user
 * @access Private
 */
router.get('/posts', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const posts = await schedulerService.getScheduledPostsByUserId(req.user.id);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/scheduler/posts/:id
 * @desc Get a scheduled post by ID
 * @access Private
 */
router.get('/posts/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await schedulerService.getScheduledPost(postId);
    if (!post) {
      return res.status(404).json({ error: 'Scheduled post not found' });
    }

    // Verify post belongs to the current user
    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this post' });
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/scheduler/posts
 * @desc Create a new scheduled post
 * @access Private
 */
router.post('/posts', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Validate request body
    try {
      const validatedData = insertScheduledPostSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const post = await schedulerService.createScheduledPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/scheduler/posts/:id
 * @desc Update a scheduled post
 * @access Private
 */
router.put('/posts/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // Verify post exists and belongs to the current user
    const existingPost = await schedulerService.getScheduledPost(postId);
    if (!existingPost) {
      return res.status(404).json({ error: 'Scheduled post not found' });
    }

    if (existingPost.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    // Update the post
    const updatedPost = await schedulerService.updateScheduledPost(postId, req.body);
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/scheduler/posts/:id
 * @desc Delete a scheduled post
 * @access Private
 */
router.delete('/posts/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // Verify post exists and belongs to the current user
    const existingPost = await schedulerService.getScheduledPost(postId);
    if (!existingPost) {
      return res.status(404).json({ error: 'Scheduled post not found' });
    }

    if (existingPost.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    // Delete the post
    await schedulerService.deleteScheduledPost(postId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/scheduler/posts/:id/publish
 * @desc Publish a scheduled post immediately
 * @access Private
 */
router.post('/posts/:id/publish', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // Verify post exists and belongs to the current user
    const existingPost = await schedulerService.getScheduledPost(postId);
    if (!existingPost) {
      return res.status(404).json({ error: 'Scheduled post not found' });
    }

    if (existingPost.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to publish this post' });
    }

    // Publish the post
    const result = await schedulerService.publishNow(postId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/scheduler/best-times/:platform
 * @desc Get the best times to post for a specific platform
 * @access Private
 */
router.get('/best-times/:platform', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const platform = req.params.platform;
    if (!platform || !['tiktok', 'instagram', 'youtube', 'twitter', 'facebook'].includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    const bestTimes = await schedulerService.getBestTimeToPost(req.user.id, platform);
    res.status(200).json({ platform, bestTimes });
  } catch (error) {
    next(error);
  }
});

export default router;