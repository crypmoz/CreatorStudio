import { Router, Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import { storage } from '../storage';
import { validateExternalApis } from '../middleware/api.middleware';
import { z } from 'zod';

const router = Router();

// Validate required API keys for AI endpoints
router.use(validateExternalApis(['openai', 'deepseek']));

// Get available AI providers
router.get('/providers', (req: Request, res: Response) => {
  try {
    const providers = aiService.getAvailableProviders();
    res.json({
      providers,
      isAvailable: aiService.isAvailable(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate content ideas
router.post('/generate-ideas', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      topic: z.string().min(3),
      targetAudience: z.string().min(3),
      contentType: z.string().optional(),
      count: z.number().min(1).max(10).optional(),
    });
    
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error });
    }
    
    const { topic, targetAudience, contentType, count } = req.body;
    const ideas = await aiService.generateContentIdeas(topic, targetAudience, contentType, count);
    
    // Save generated ideas to storage
    const userId = req.user?.id || 1; // Use authenticated user ID if available
    
    const savedIdeas = [];
    for (const idea of ideas) {
      const keyPoints = Array.isArray(idea.keyPoints) 
        ? idea.keyPoints.join('\n') 
        : idea.keyPoints || idea.key_points || '';
      
      const hashtags = Array.isArray(idea.hashtags) 
        ? idea.hashtags.join(' ') 
        : idea.hashtags || '';
      
      const savedIdea = await storage.createContentIdea({
        userId,
        title: idea.title,
        description: idea.description,
        keyPoints,
        hashtags,
        estimatedEngagement: typeof idea.estimatedEngagement === 'string' 
          ? (idea.estimatedEngagement === 'high' ? 0.8 : idea.estimatedEngagement === 'medium' ? 0.5 : 0.3)
          : null,
        niche: targetAudience,
        prompt: topic,
        platform: contentType || 'tiktok',
        aiGenerated: true
      });
      
      savedIdeas.push(savedIdea);
    }
    
    res.json(savedIdeas);
  } catch (error: any) {
    console.error('Error generating ideas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate content draft from idea
router.post('/generate-draft', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      ideaId: z.number().positive(),
    });
    
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error });
    }
    
    const { ideaId } = req.body;
    const idea = await storage.getContentIdea(ideaId);
    
    if (!idea) {
      return res.status(404).json({ error: 'Content idea not found' });
    }
    
    const draft = await aiService.generateContentDraft(idea);
    
    // Save generated draft to storage
    const userId = req.user?.id || idea.userId;
    
    const savedDraft = await storage.createContentDraft({
      userId,
      ideaId,
      title: idea.title,
      content: draft.content,
      hook: draft.hook,
      structure: JSON.stringify(draft.structure),
      callToAction: draft.callToAction,
      platform: 'tiktok',
      status: 'draft'
    });
    
    res.json(savedDraft);
  } catch (error: any) {
    console.error('Error generating draft:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate image prompts from content draft
router.post('/generate-image-prompts', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      draftId: z.number().positive(),
    });
    
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error });
    }
    
    const { draftId } = req.body;
    const draft = await storage.getContentDraft(draftId);
    
    if (!draft) {
      return res.status(404).json({ error: 'Content draft not found' });
    }
    
    const imagePrompts = await aiService.generateImagePrompts(draft);
    
    res.json(imagePrompts);
  } catch (error: any) {
    console.error('Error generating image prompts:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;