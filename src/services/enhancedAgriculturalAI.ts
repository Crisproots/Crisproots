import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyAQMuttFKBjxdZoiIs6d9uGzBML0Ific0Y';

if (!API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

// Enhanced agricultural AI service with real data integration
// Enhanced agricultural AI service with real data integration
export interface AgriculturalQuery {
  message: string;
  context?: {
    weather?: {
      temperature: number;
      humidity: number;
      windSpeed: number;
      precipitation: number;
      condition: string;
    };
    soil?: {
      pH: number;
      nitrogen: number;
      organicMatter: number;
      texture: string;
      moisture: number;
    };
    location?: {
      latitude: number;
      longitude: number;
      region: string;
    };
    crop?: string;
    growthStage?: string;
    farmSize?: string;
    season?: string;
  };
  language?: 'english' | 'hindi' | 'mixed';
}

export interface AgriculturalResponse {
  response: string;
  confidence: number;
  suggestions: string[];
  warnings?: string[];
  relatedTopics: string[];
  actionItems?: string[];
}

class EnhancedAgriculturalAI {
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  async getAgriculturalAdvice(query: AgriculturalQuery): Promise<AgriculturalResponse> {
    try {
      const enhancedPrompt = this.buildEnhancedPrompt(query);
      
      const result = await model.generateContent(enhancedPrompt);
      const response = result.response;
      const text = response.text();

      // Add to conversation history
      this.conversationHistory.push(
        { role: 'user', content: query.message },
        { role: 'assistant', content: text }
      );

      // Keep only last 10 exchanges to manage context
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return this.parseResponse(text, query);
    } catch (error) {
      console.error('Error getting agricultural advice:', error);
      throw new Error('Failed to get agricultural advice. Please try again.');
    }
  }

  private buildEnhancedPrompt(query: AgriculturalQuery): string {
    const { message, context, language = 'mixed' } = query;
    
    let prompt = `You are an expert agricultural AI assistant with deep knowledge of Indian farming practices, crop management, soil science, and sustainable agriculture. 

CONTEXT INFORMATION:`;

    if (context?.weather) {
      prompt += `
CURRENT WEATHER CONDITIONS:
- Temperature: ${context.weather.temperature}°C
- Humidity: ${context.weather.humidity}%
- Wind Speed: ${context.weather.windSpeed} km/h
- Precipitation: ${context.weather.precipitation}mm
- Condition: ${context.weather.condition}`;
    }

    if (context?.soil) {
      prompt += `
SOIL ANALYSIS:
- pH Level: ${context.soil.pH}
- Nitrogen Content: ${context.soil.nitrogen} mg/kg
- Organic Matter: ${context.soil.organicMatter}%
- Soil Texture: ${context.soil.texture}
- Moisture Level: ${context.soil.moisture}%`;
    }

    if (context?.location) {
      prompt += `
LOCATION DATA:
- Coordinates: ${context.location.latitude}, ${context.location.longitude}
- Region: ${context.location.region}`;
    }

    if (context?.crop) {
      prompt += `
CURRENT CROP: ${context.crop}`;
    }

    if (context?.growthStage) {
      prompt += `
GROWTH STAGE: ${context.growthStage}`;
    }

    prompt += `

CONVERSATION HISTORY:
${this.conversationHistory.map(entry => `${entry.role}: ${entry.content}`).join('\\n')}

USER QUESTION: ${message}

INSTRUCTIONS:
1. Provide practical, actionable advice specific to Indian agricultural conditions
2. Use both English and Hindi terms where appropriate (language preference: ${language})
3. Consider the provided real-time weather and soil data in your recommendations
4. Include specific numbers, measurements, and timelines
5. Address potential risks and preventive measures
6. Suggest cost-effective solutions suitable for Indian farmers
7. Include seasonal considerations and local agricultural practices
8. Provide step-by-step instructions when relevant

RESPONSE FORMAT:
- Main advice (comprehensive answer)
- Immediate action items (if any urgent actions needed)
- Preventive measures (if risks identified)
- Additional suggestions (related recommendations)
- Cost estimates (when relevant)

Focus on practical, implementable solutions that consider the farmer's resources and local conditions.`;

    return prompt;
  }

  private parseResponse(text: string, query: AgriculturalQuery): AgriculturalResponse {
    // Extract suggestions from the response
    const suggestions = this.extractSuggestions(text);
    
    // Extract warnings/alerts
    const warnings = this.extractWarnings(text);
    
    // Extract action items
    const actionItems = this.extractActionItems(text);
    
    // Generate related topics
    const relatedTopics = this.generateRelatedTopics(query);
    
    // Calculate confidence based on context completeness
    const confidence = this.calculateConfidence(query);

    return {
      response: text,
      confidence,
      suggestions,
      warnings,
      relatedTopics,
      actionItems
    };
  }

  private extractSuggestions(text: string): string[] {
    const suggestionPatterns = [
      /- (.*?)(?=\\n|$)/g,
      /\\d+\\. (.*?)(?=\\n|$)/g,
      /Recommendation: (.*?)(?=\\n|$)/gi,
      /Suggest(?:ion)?: (.*?)(?=\\n|$)/gi
    ];

    const suggestions: string[] = [];
    
    suggestionPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const cleaned = match.replace(/^[-\\d+\\.\\s]*/, '').trim();
          if (cleaned.length > 10 && !suggestions.includes(cleaned)) {
            suggestions.push(cleaned);
          }
        });
      }
    });

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  private extractWarnings(text: string): string[] {
    const warningPatterns = [
      /(?:Warning|Alert|Caution|Risk|Danger)[:\\s]+(.*?)(?=\\n|$)/gi,
      /(?:Avoid|Don't|Never)[:\\s]+(.*?)(?=\\n|$)/gi,
      /(?:⚠️|🚨|❌)(.*?)(?=\\n|$)/g
    ];

    const warnings: string[] = [];
    
    warningPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const cleaned = match.replace(/^[^a-zA-Z]*/, '').trim();
          if (cleaned.length > 10 && !warnings.includes(cleaned)) {
            warnings.push(cleaned);
          }
        });
      }
    });

    return warnings.slice(0, 3); // Return top 3 warnings
  }

  private extractActionItems(text: string): string[] {
    const actionPatterns = [
      /(?:Immediate|Urgent|Action|Steps?)[:\\s]+([^\\n]*)/gi,
      /(?:Today|Tomorrow|This week)[:\\s]+([^\\n]*)/gi,
      /(?:Apply|Spray|Water|Fertilize|Plant)[:\\s]+([^\\n]*)/gi
    ];

    const actionItems: string[] = [];
    
    actionPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const cleaned = match.replace(/^[^a-zA-Z]*/, '').trim();
          if (cleaned.length > 10 && !actionItems.includes(cleaned)) {
            actionItems.push(cleaned);
          }
        });
      }
    });

    return actionItems.slice(0, 4); // Return top 4 action items
  }

  private generateRelatedTopics(query: AgriculturalQuery): string[] {
    const baseTopics = [
      'Crop rotation strategies',
      'Pest management techniques',
      'Soil health improvement',
      'Water conservation methods',
      'Organic farming practices',
      'Seasonal planning guide',
      'Fertilizer recommendations',
      'Market price analysis'
    ];

    // Filter topics based on query context
    if (query.context?.crop) {
      baseTopics.unshift(
        `${query.context.crop} cultivation tips`,
        `${query.context.crop} disease prevention`,
        `Best practices for ${query.context.crop}`
      );
    }

    if (query.context?.weather?.temperature && query.context.weather.temperature > 35) {
      baseTopics.unshift('Heat stress management', 'Summer crop protection');
    }

    if (query.context?.soil?.pH && (query.context.soil.pH < 6 || query.context.soil.pH > 8)) {
      baseTopics.unshift('Soil pH correction methods', 'Acidic/Alkaline soil management');
    }

    return baseTopics.slice(0, 6);
  }

  private calculateConfidence(query: AgriculturalQuery): number {
    let confidence = 70; // Base confidence

    // Increase confidence based on available context
    if (query.context?.weather) confidence += 10;
    if (query.context?.soil) confidence += 10;
    if (query.context?.location) confidence += 5;
    if (query.context?.crop) confidence += 5;

    // Increase confidence for specific agricultural terms
    const agriculturalTerms = [
      'crop', 'soil', 'fertilizer', 'pest', 'disease', 'irrigation', 
      'harvest', 'plant', 'seed', 'growth', 'yield', 'farming'
    ];
    
    const message = query.message.toLowerCase();
    const termCount = agriculturalTerms.filter(term => message.includes(term)).length;
    confidence += Math.min(termCount * 2, 10);

    return Math.min(confidence, 95); // Cap at 95%
  }

  // Disease and pest identification from image analysis
  async analyzeImage(imageData: string, additionalContext?: string): Promise<{
    diagnosis: string;
    confidence: number;
    treatment: string[];
    prevention: string[];
  }> {
    try {
      const prompt = `Analyze this agricultural image and provide:
1. Disease/pest identification
2. Confidence level (0-100%)
3. Treatment recommendations
4. Prevention strategies

Additional context: ${additionalContext || 'General crop analysis'}

Focus on common Indian agricultural issues and provide practical solutions.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageData,
            mimeType: 'image/jpeg'
          }
        }
      ]);

      const response = result.response.text();
      
      return {
        diagnosis: response,
        confidence: 85, // Default confidence for image analysis
        treatment: this.extractSuggestions(response),
        prevention: this.extractWarnings(response)
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image. Please try again.');
    }
  }

  // Clear conversation history
  clearHistory(): void {
    this.conversationHistory = [];
  }

  // Get conversation summary
  getConversationSummary(): string {
    if (this.conversationHistory.length === 0) {
      return 'No conversation history available.';
    }

    return this.conversationHistory
      .slice(-6) // Last 3 exchanges
      .map(entry => `${entry.role}: ${entry.content.slice(0, 100)}...`)
      .join('\\n');
  }
}

const enhancedAgriculturalAI = new EnhancedAgriculturalAI();
export default enhancedAgriculturalAI;
