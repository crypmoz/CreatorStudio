import { config, OPENAI_API_KEY } from '../config/env';
import { ContentIdea, ContentDraft } from '@shared/schema';

/**
 * Service for AI operations using DeepSeek API
 */
export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.api.openai || OPENAI_API_KEY;
    this.baseUrl = 'https://api.deepseek.com';
  }

  /**
   * Generate content ideas based on user preferences and target audience
   * @param topic The general topic for content ideas
   * @param targetAudience Target audience details
   * @param contentType Type of content (e.g., video, blog, etc.)
   * @param count Number of ideas to generate
   * @returns Array of content ideas
   */
  async generateContentIdeas(
    topic: string,
    targetAudience: string,
    contentType: string = 'TikTok video',
    count: number = 5
  ): Promise<Partial<ContentIdea>[]> {
    const prompt = `
      Generate ${count} unique and engaging ${contentType} ideas about ${topic} for ${targetAudience}.
      For each idea, provide:
      1. A catchy title (max 60 characters)
      2. A brief description (2-3 sentences)
      3. Key points to cover (3-5 bullet points)
      4. Potential hashtags (5-7 hashtags)
      5. Estimated audience engagement score (1-10)
      
      Format the response as a JSON array where each object has properties:
      - title: string
      - description: string
      - keyPoints: string[]
      - hashtags: string[]
      - estimatedEngagement: number
    `;

    try {
      const response = await this.callDeepSeekAPI(prompt);
      let parsedResponse;
      
      try {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\\[\\s*\\n*{[\\s\\S]*}\\s*\\n*\\]/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON array found, try to parse the entire response
          parsedResponse = JSON.parse(response);
        }
      } catch (e) {
        console.error('Failed to parse DeepSeek API response as JSON:', e);
        // Create a structured response from unstructured text as fallback
        parsedResponse = this.extractIdeasFromText(response, count);
      }

      // Map the response to ContentIdea format
      return parsedResponse.map((idea: any) => ({
        title: idea.title,
        description: idea.description,
        keyPoints: idea.keyPoints.join('\\n'),
        hashtags: idea.hashtags.join(' '),
        estimatedEngagement: idea.estimatedEngagement,
        status: 'draft',
      }));
    } catch (error) {
      console.error('Error generating content ideas:', error);
      throw new Error('Failed to generate content ideas');
    }
  }

  /**
   * Generate a content draft based on a content idea
   * @param idea The content idea to generate a draft for
   * @returns A content draft
   */
  async generateContentDraft(idea: ContentIdea): Promise<Partial<ContentDraft>> {
    const prompt = `
      Create a detailed script for a ${idea.platform || 'TikTok'} video based on the following idea:
      
      Title: ${idea.title}
      Description: ${idea.description}
      Key Points: ${idea.keyPoints}
      Hashtags: ${idea.hashtags}
      
      Generate a script with the following:
      1. An attention-grabbing hook (first 3 seconds)
      2. Content structure with timing (e.g., 0:00-0:10 - Introduction)
      3. Full script with dialogue and action cues
      4. Background music or sound effect suggestions
      5. Visual transition recommendations
      6. Call to action at the end
      
      Format as a JSON object with:
      - hook: string
      - structure: array of {time: string, section: string}
      - script: string (full script)
      - audioSuggestions: string[]
      - visualEffects: string[]
      - callToAction: string
    `;

    try {
      const response = await this.callDeepSeekAPI(prompt);
      let parsedResponse;
      
      try {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/{[\s\S]*}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON object found, try to parse the entire response
          parsedResponse = JSON.parse(response);
        }
      } catch (e) {
        console.error('Failed to parse DeepSeek API response as JSON:', e);
        // Create a structured response from unstructured text as fallback
        parsedResponse = this.extractDraftFromText(response);
      }

      // Extract the script components
      return {
        ideaId: idea.id,
        title: idea.title,
        content: parsedResponse.script,
        hook: parsedResponse.hook,
        structure: JSON.stringify(parsedResponse.structure),
        audioSuggestions: parsedResponse.audioSuggestions.join('\\n'),
        visualEffects: parsedResponse.visualEffects.join('\\n'),
        callToAction: parsedResponse.callToAction,
        status: 'draft',
      };
    } catch (error) {
      console.error('Error generating content draft:', error);
      throw new Error('Failed to generate content draft');
    }
  }

  /**
   * Generate image prompts for content based on the draft
   * @param draft The content draft to generate image prompts for
   * @returns Array of image prompt suggestions
   */
  async generateImagePrompts(draft: ContentDraft): Promise<string[]> {
    const prompt = `
      Based on the following content draft for a ${draft.platform || 'TikTok'} video, 
      generate 5 detailed image generation prompts that would create visually appealing 
      graphics to accompany this content.
      
      Content Title: ${draft.title}
      Content: ${draft.content}
      
      For each image prompt:
      1. Describe the subject matter clearly
      2. Specify visual style (e.g., minimalist, vibrant, photorealistic)
      3. Mention color scheme and mood
      4. Add technical details (e.g., lighting, perspective)
      
      Format the response as a JSON array of strings.
    `;

    try {
      const response = await this.callDeepSeekAPI(prompt);
      let parsedResponse;
      
      try {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\\[[\s\S]*\\]/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON array found, try to parse the entire response
          parsedResponse = JSON.parse(response);
        }
      } catch (e) {
        console.error('Failed to parse DeepSeek API response as JSON:', e);
        // Extract prompts from text as fallback
        parsedResponse = response
          .split(/\\d+\\./)
          .filter(prompt => prompt.trim().length > 0)
          .map(prompt => prompt.trim());
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error generating image prompts:', error);
      throw new Error('Failed to generate image prompts');
    }
  }

  /**
   * Analyze a video for potential virality and engagement
   * @param metadata Video metadata to analyze
   * @returns Analysis with scores and recommendations
   */
  async analyzeVideoVirality(metadata: {
    title: string;
    description: string;
    hashtags: string;
    duration: number;
    category: string;
  }): Promise<{
    viralityScore: number;
    engagement: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  }> {
    const prompt = `
      Analyze the following TikTok video metadata for virality potential:
      
      Title: ${metadata.title}
      Description: ${metadata.description}
      Hashtags: ${metadata.hashtags}
      Duration: ${metadata.duration} seconds
      Category: ${metadata.category}
      
      Provide a comprehensive analysis including:
      1. Virality Score (1-100)
      2. Estimated Engagement Rate (%)
      3. Content Strengths (3-5 points)
      4. Content Weaknesses (3-5 points)
      5. Recommendations for Improvement (3-5 points)
      
      Format the response as a JSON object with:
      - viralityScore: number
      - engagement: number
      - strengths: string[]
      - weaknesses: string[]
      - recommendations: string[]
    `;

    try {
      const response = await this.callDeepSeekAPI(prompt);
      let parsedResponse;
      
      try {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/{[\s\S]*}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON object found, try to parse the entire response
          parsedResponse = JSON.parse(response);
        }
      } catch (e) {
        console.error('Failed to parse DeepSeek API response as JSON:', e);
        // Create a structured analysis from unstructured text
        parsedResponse = {
          viralityScore: 50,
          engagement: 5,
          strengths: ['Could not parse strengths'],
          weaknesses: ['Could not parse weaknesses'],
          recommendations: ['Could not parse recommendations'],
        };
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error analyzing video virality:', error);
      throw new Error('Failed to analyze video virality');
    }
  }

  /**
   * Private method to call the DeepSeek API
   * @param prompt The prompt to send to the API
   * @returns The API response text
   */
  private async callDeepSeekAPI(prompt: string): Promise<string> {
    try {
      // OpenAI API request instead of DeepSeek
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`DeepSeek API error: ${response.status} ${error}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      
      // If API fails, return simulated response for testing
      console.log('Returning simulated response for testing');
      
      return JSON.stringify({
        "title": "Sample Title",
        "description": "This is a sample description",
        "keyPoints": ["Point 1", "Point 2", "Point 3"],
        "hashtags": ["#sample", "#test", "#demo"],
        "estimatedEngagement": 7
      });
    }
  }

  /**
   * Extract content ideas from unstructured text response
   * @param text The text to extract ideas from
   * @param count Number of ideas expected
   * @returns Structured content ideas
   */
  private extractIdeasFromText(text: string, count: number): any[] {
    const ideas = [];
    
    // Simple pattern matching to find ideas in the text
    const ideaSections = text.split(/Idea \d+:|#\d+:/);
    
    for (let i = 1; i <= count && i < ideaSections.length; i++) {
      const section = ideaSections[i];
      
      // Extract title (first line or sentence)
      const titleMatch = section.match(/Title:?\s*([^\\n.]+)/i) || 
                         section.match(/^\\s*([^\\n.]+)/);
      const title = titleMatch ? titleMatch[1].trim() : `Content Idea ${i}`;
      
      // Extract description
      const descMatch = section.match(/Description:?\s*([^\\n]+)/i) || 
                        section.match(/^\\s*[^\\n.]+\\s*[.\\n]\\s*([^\\n]+)/);
      const description = descMatch ? descMatch[1].trim() : '';
      
      // Extract key points
      const keyPointsMatch = section.match(/Key Points:?\\s*([\\s\\S]*?)(?=Hashtags:|Estimated|$)/i);
      let keyPoints: string[] = [];
      if (keyPointsMatch) {
        keyPoints = keyPointsMatch[1]
          .split(/\\*|-|\\d+\\./)
          .map(point => point.trim())
          .filter(point => point.length > 0);
      }
      
      // Extract hashtags
      const hashtagsMatch = section.match(/Hashtags:?\\s*([\\s\\S]*?)(?=Estimated|$)/i);
      let hashtags: string[] = [];
      if (hashtagsMatch) {
        hashtags = hashtagsMatch[1]
          .split(/\\s+/)
          .map(tag => tag.trim())
          .filter(tag => tag.startsWith('#') || (tag = `#${tag}`));
      }
      
      // Extract estimated engagement
      const engagementMatch = section.match(/Estimated\\s*Engagement:?\\s*(\\d+)/i) ||
                              section.match(/Score:?\\s*(\\d+)/i);
      const estimatedEngagement = engagementMatch ? parseInt(engagementMatch[1], 10) : 5;
      
      ideas.push({
        title,
        description,
        keyPoints: keyPoints.length > 0 ? keyPoints : ['Point 1', 'Point 2', 'Point 3'],
        hashtags: hashtags.length > 0 ? hashtags : ['#tiktok', '#trending', '#content'],
        estimatedEngagement,
      });
    }
    
    // If we couldn't extract enough ideas, pad with defaults
    while (ideas.length < count) {
      ideas.push({
        title: `Content Idea ${ideas.length + 1}`,
        description: 'An engaging content idea for your audience.',
        keyPoints: ['Point 1', 'Point 2', 'Point 3'],
        hashtags: ['#tiktok', '#trending', '#content'],
        estimatedEngagement: 5,
      });
    }
    
    return ideas;
  }

  /**
   * Extract content draft from unstructured text response
   * @param text The text to extract draft from
   * @returns Structured content draft
   */
  private extractDraftFromText(text: string): any {
    // Extract hook (first few lines or content after "Hook:" label)
    const hookMatch = text.match(/Hook:?\\s*([^\\n]+)/i) || 
                     text.match(/^\\s*([^\\n.]+)/);
    const hook = hookMatch ? hookMatch[1].trim() : 'Attention-grabbing opening hook';
    
    // Extract structure
    const structureMatch = text.match(/Structure:?\\s*([\\s\\S]*?)(?=Script:|Full Script:|$)/i);
    let structure: {time: string, section: string}[] = [];
    
    if (structureMatch) {
      const structureText = structureMatch[1];
      const timeSegments = structureText.match(/(\\d+:\\d+(?:-\\d+:\\d+)?)[\\s-]*(.*?)(?=\\d+:\\d+|$)/g);
      
      if (timeSegments) {
        structure = timeSegments.map(segment => {
          const [time, section] = segment.split(/\\s*-\\s*/);
          return { 
            time: time.trim(), 
            section: section?.trim() || 'Content section' 
          };
        });
      }
    }
    
    // If no structure was found, create a default one
    if (structure.length === 0) {
      structure = [
        { time: '0:00-0:10', section: 'Introduction/Hook' },
        { time: '0:10-0:30', section: 'Main Content' },
        { time: '0:30-0:50', section: 'Details/Examples' },
        { time: '0:50-1:00', section: 'Conclusion/Call to Action' }
      ];
    }
    
    // Extract script
    const scriptMatch = text.match(/(?:Script|Full Script):?\\s*([\\s\\S]*?)(?=Audio|Visual|Call to Action:|$)/i);
    const script = scriptMatch ? scriptMatch[1].trim() : text.trim();
    
    // Extract audio suggestions
    const audioMatch = text.match(/Audio\\s*Suggestions:?\\s*([\\s\\S]*?)(?=Visual|Call to Action:|$)/i);
    let audioSuggestions: string[] = [];
    
    if (audioMatch) {
      audioSuggestions = audioMatch[1]
        .split(/\\*|-|\\d+\\./)
        .map(audio => audio.trim())
        .filter(audio => audio.length > 0);
    }
    
    // Extract visual effects
    const visualMatch = text.match(/Visual\\s*(?:Effects|Transitions):?\\s*([\\s\\S]*?)(?=Call to Action:|$)/i);
    let visualEffects: string[] = [];
    
    if (visualMatch) {
      visualEffects = visualMatch[1]
        .split(/\\*|-|\\d+\\./)
        .map(effect => effect.trim())
        .filter(effect => effect.length > 0);
    }
    
    // Extract call to action
    const ctaMatch = text.match(/Call\\s*to\\s*Action:?\\s*([\\s\\S]*?)(?=$)/i);
    const callToAction = ctaMatch ? ctaMatch[1].trim() : 'Follow for more content like this!';
    
    return {
      hook,
      structure,
      script,
      audioSuggestions: audioSuggestions.length > 0 ? audioSuggestions : ['Upbeat background music', 'Sound effects for transitions'],
      visualEffects: visualEffects.length > 0 ? visualEffects : ['Zoom transitions', 'Text overlays', 'Visual highlights'],
      callToAction
    };
  }
}

export const aiService = new AIService();