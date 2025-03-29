import { Router, Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';
import { isAuthenticated as authenticate } from '../middleware/auth.middleware';
import { storage } from '../storage';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

const router = Router();

// Generate content ideas schema
const generateIdeasSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  targetAudience: z.string().min(3, "Target audience must be at least 3 characters"),
  contentType: z.string().optional(),
  count: z.number().min(1).max(10).optional(),
});

// Generate content draft schema
const generateDraftSchema = z.object({
  ideaId: z.number(),
});

// Analyze video virality schema
const analyzeViralitySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  hashtags: z.string(),
  duration: z.number().min(1),
  category: z.string(),
});

// Generate image prompts schema
const generateImagePromptsSchema = z.object({
  draftId: z.number(),
});

/**
 * @route POST /api/ai/generate-ideas
 * @desc Generate content ideas using AI
 * @access Private
 */
router.post('/generate-ideas', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate request body
    const validatedData = generateIdeasSchema.parse(req.body);
    
    // Generate ideas
    const ideas = await aiService.generateContentIdeas(
      validatedData.topic,
      validatedData.targetAudience,
      validatedData.contentType,
      validatedData.count
    );
    
    // Save ideas to database
    const savedIdeas = await Promise.all(
      ideas.map(idea => storage.createContentIdea({
        ...idea, 
        userId: req.user!.id,
        status: 'draft',
        createdAt: new Date(),
      }))
    );
    
    res.status(201).json(savedIdeas);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    
    next(error);
  }
});

/**
 * @route POST /api/ai/generate-draft
 * @desc Generate content draft from idea using AI
 * @access Private
 */
router.post('/generate-draft', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate request body
    const validatedData = generateDraftSchema.parse(req.body);
    
    // Get the idea
    const idea = await storage.getContentIdea(validatedData.ideaId);
    if (!idea) {
      return res.status(404).json({ error: 'Content idea not found' });
    }
    
    // Check if the idea belongs to the user
    if (idea.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access to content idea' });
    }
    
    // Generate draft
    const draftData = await aiService.generateContentDraft(idea);
    
    // Save draft to database
    const savedDraft = await storage.createContentDraft({
      ...draftData,
      userId: req.user.id,
      ideaId: idea.id,
      createdAt: new Date(),
    });
    
    // Update idea status to 'in-progress'
    await storage.updateContentIdea(idea.id, { status: 'in-progress' });
    
    res.status(201).json(savedDraft);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    
    next(error);
  }
});

/**
 * @route POST /api/ai/analyze-virality
 * @desc Analyze video for virality potential
 * @access Private
 */
router.post('/analyze-virality', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate request body
    const validatedData = analyzeViralitySchema.parse(req.body);
    
    // Analyze virality
    const analysis = await aiService.analyzeVideoVirality(validatedData);
    
    res.status(200).json(analysis);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    
    next(error);
  }
});

/**
 * @route POST /api/ai/generate-image-prompts
 * @desc Generate image prompts for content
 * @access Private
 */
router.post('/generate-image-prompts', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate request body
    const validatedData = generateImagePromptsSchema.parse(req.body);
    
    // Get the draft
    const draft = await storage.getContentDraft(validatedData.draftId);
    if (!draft) {
      return res.status(404).json({ error: 'Content draft not found' });
    }
    
    // Check if the draft belongs to the user
    if (draft.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access to content draft' });
    }
    
    // Generate image prompts
    const prompts = await aiService.generateImagePrompts(draft);
    
    res.status(200).json(prompts);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    
    next(error);
  }
});

export default router;