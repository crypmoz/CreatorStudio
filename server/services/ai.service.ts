import { OpenAI } from 'openai';
import { OPENAI_API_KEY, DEEPSEEK_API_KEY } from '../config/env';

// Initialize the OpenAI client if API key is available
let openai: OpenAI | null = null;
if (OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
}

// DeepSeek API implementation (simplified for now, would integrate with their SDK)
const deepseekApi = {
  available: !!DEEPSEEK_API_KEY,
  async generateCompletion(prompt: string, options: any = {}) {
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key not configured');
    }
    
    // Actual implementation would use DeepSeek's SDK or direct API calls
    // This is a placeholder for demonstration
    try {
      const response = await fetch('https://api.deepseek.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: options.model || 'deepseek-chat',
          max_tokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate completion with DeepSeek');
      }
      
      return await response.json();
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }
};

// Class to handle AI operations with provider fallback support
export class AIService {
  private openai: OpenAI | null;
  private deepseekAvailable: boolean;
  
  constructor() {
    this.openai = openai;
    this.deepseekAvailable = deepseekApi.available;
    
    // Log configuration status
    if (!this.openai && !this.deepseekAvailable) {
      console.warn('No AI providers configured. Set OPENAI_API_KEY or DEEPSEEK_API_KEY to enable AI features.');
    } else if (this.deepseekAvailable) {
      console.log('DeepSeek AI provider configured.');
      if (!this.openai) {
        console.log('OpenAI provider not available, using DeepSeek exclusively.');
      } else {
        console.log('OpenAI provider available as fallback.');
      }
    } else if (this.openai) {
      console.log('OpenAI provider configured.');
      console.log('DeepSeek API key not found, falling back to OpenAI');
    }
  }
  
  /**
   * Generate content ideas based on topic and audience
   */
  async generateContentIdeas(topic: string, targetAudience: string, contentType: string = 'TikTok video', count: number = 3) {
    const prompt = `Generate ${count} creative content ideas for ${contentType} about "${topic}" 
      targeting ${targetAudience}. For each idea, provide:
      1. A catchy title (35 characters max)
      2. A brief description (120 characters max)
      3. 3-5 key points to cover
      4. 5 relevant hashtags
      5. Estimated engagement potential (high/medium/low)
      
      Focus on engaging, trending formats that work well on TikTok.
      Format as a JSON array.`;
    
    try {
      // Try DeepSeek first if available
      if (this.deepseekAvailable) {
        try {
          const response = await deepseekApi.generateCompletion(prompt, {
            temperature: 0.8,
            maxTokens: 2000,
          });
          
          return this.parseGeneratedContent(response.choices[0].text, 'ideas');
        } catch (error) {
          console.warn('DeepSeek API error, falling back to OpenAI:', error);
          // Fall back to OpenAI if DeepSeek fails
          if (!this.openai) throw error;
        }
      }
      
      // Use OpenAI if DeepSeek is not available or failed
      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a TikTok content strategy expert who helps creators plan viral content.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
          max_tokens: 2000,
        });
        
        return this.parseGeneratedContent(response.choices[0].message.content || '', 'ideas');
      }
      
      throw new Error('No AI provider available');
    } catch (error) {
      console.error('Error generating content ideas:', error);
      throw error;
    }
  }
  
  /**
   * Generate a content draft from an idea
   */
  async generateContentDraft(idea: any) {
    const prompt = `Create a detailed TikTok video script based on this content idea:
      Title: ${idea.title}
      Description: ${idea.description}
      Key points: ${idea.keyPoints || idea.key_points || ''}
      Target audience: ${idea.targetAudience || idea.niche || 'TikTok users'}
      
      Create a complete script with:
      1. An attention-grabbing hook (first 3 seconds)
      2. Main content structure with timing
      3. Call to action
      4. Music/sound suggestions
      5. Visual elements and effects
      
      Format the script in a way that's easy to follow while filming.`;
    
    try {
      // Try DeepSeek first if available
      if (this.deepseekAvailable) {
        try {
          const response = await deepseekApi.generateCompletion(prompt, {
            temperature: 0.7,
            maxTokens: 2500,
          });
          
          return this.parseGeneratedContent(response.choices[0].text, 'draft');
        } catch (error) {
          console.warn('DeepSeek API error, falling back to OpenAI:', error);
          // Fall back to OpenAI if DeepSeek fails
          if (!this.openai) throw error;
        }
      }
      
      // Use OpenAI if DeepSeek is not available or failed
      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a TikTok content creation assistant who excels at writing engaging video scripts.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2500,
        });
        
        return this.parseGeneratedContent(response.choices[0].message.content || '', 'draft');
      }
      
      throw new Error('No AI provider available');
    } catch (error) {
      console.error('Error generating content draft:', error);
      throw error;
    }
  }
  
  /**
   * Generate image prompts based on content draft
   */
  async generateImagePrompts(draft: any) {
    const prompt = `Based on this TikTok video script:
      "${draft.title}: ${draft.content.substring(0, 300)}..."
      
      Generate 5 detailed image generation prompts that would create visuals to support this content.
      Each prompt should be specific, detailed, and ready to use with image generation AI.
      Format as a JSON array of strings.`;
    
    try {
      // Try DeepSeek first if available
      if (this.deepseekAvailable) {
        try {
          const response = await deepseekApi.generateCompletion(prompt, {
            temperature: 0.8,
            maxTokens: 1500,
          });
          
          return this.parseGeneratedContent(response.choices[0].text, 'imagePrompts');
        } catch (error) {
          console.warn('DeepSeek API error, falling back to OpenAI:', error);
          // Fall back to OpenAI if DeepSeek fails
          if (!this.openai) throw error;
        }
      }
      
      // Use OpenAI if DeepSeek is not available or failed
      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are an AI image prompt engineering expert.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
          max_tokens: 1500,
        });
        
        return this.parseGeneratedContent(response.choices[0].message.content || '', 'imagePrompts');
      }
      
      throw new Error('No AI provider available');
    } catch (error) {
      console.error('Error generating image prompts:', error);
      throw error;
    }
  }
  
  /**
   * Helper method to parse AI-generated content
   */
  private parseGeneratedContent(content: string, type: 'ideas' | 'draft' | 'imagePrompts') {
    try {
      // Try to extract JSON from the response if it's wrapped in markdown or other text
      const jsonPattern = /```(?:json)?\s*(\[[\s\S]*?\]|\{[\s\S]*?\})\s*```/;
      const jsonMatch = content.match(jsonPattern);
      if (jsonMatch && jsonMatch[1]) {
        content = jsonMatch[1];
      }
      
      // Clean up the content for parsing
      content = content.trim();
      
      // For ideas and image prompts, expect a JSON array
      if (type === 'ideas' || type === 'imagePrompts') {
        if (!content.startsWith('[')) {
          // If not properly formatted, try to find an array within the text
          const arrayPattern = /\[\s*\{[\s\S]*\}\s*\]/;
          const possibleArray = content.match(arrayPattern);
          if (possibleArray) {
            content = possibleArray[0];
          } else {
            // If we still can't find an array, make our best guess
            content = `[${content}]`;
          }
        }
        
        return JSON.parse(content);
      }
      
      // For draft, we expect a more freeform text that needs to be structured
      if (type === 'draft') {
        // Try to extract sections
        const hookPattern = /hook:?\s*(.*?)(?=\n\n|$)/i;
        const structurePattern = /structure:?\s*([\s\S]*?)(?=\n\n(?:call to action:|$)|$)/i;
        const ctaPattern = /call to action:?\s*(.*?)(?=\n\n|$)/i;
        
        const hookMatch = content.match(hookPattern);
        const structureMatch = content.match(structurePattern);
        const ctaMatch = content.match(ctaPattern);
        
        return {
          hook: hookMatch ? hookMatch[1].trim() : '',
          structure: structureMatch ? structureMatch[1].trim() : content,
          callToAction: ctaMatch ? ctaMatch[1].trim() : '',
          content: content
        };
      }
      
      return content;
    } catch (error) {
      console.error(`Error parsing ${type} from AI response:`, error);
      // Return the raw content if parsing fails
      return type === 'imagePrompts' ? [] : content;
    }
  }
  
  /**
   * Check if any AI provider is available
   */
  isAvailable() {
    return !!(this.openai || this.deepseekAvailable);
  }
  
  /**
   * Get the available providers
   */
  getAvailableProviders() {
    const providers = [];
    if (this.deepseekAvailable) providers.push('deepseek');
    if (this.openai) providers.push('openai');
    return providers;
  }
}

// Export a singleton instance
export const aiService = new AIService();