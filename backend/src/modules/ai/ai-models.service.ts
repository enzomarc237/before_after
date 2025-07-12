import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiModelsService {
  
  async getAvailableModels(provider?: string) {
    const allModels = {
      openai: {
        name: 'OpenAI',
        models: [
          {
            id: 'gpt-4o',
            name: 'GPT-4o',
            description: 'Latest multimodal model with vision capabilities',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 128000,
            recommended: true
          },
          {
            id: 'gpt-4o-mini',
            name: 'GPT-4o Mini',
            description: 'Fast and cost-effective version of GPT-4o',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 128000,
            recommended: false
          },
          {
            id: 'gpt-4-turbo',
            name: 'GPT-4 Turbo',
            description: 'High-performance model with 128k context',
            capabilities: ['text', 'code'],
            contextLength: 128000,
            recommended: false
          },
          {
            id: 'gpt-4-vision-preview',
            name: 'GPT-4 Vision',
            description: 'GPT-4 with vision capabilities',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 128000,
            recommended: false
          },
          {
            id: 'gpt-4',
            name: 'GPT-4',
            description: 'Original GPT-4 model',
            capabilities: ['text', 'code'],
            contextLength: 8192,
            recommended: false
          },
          {
            id: 'gpt-3.5-turbo',
            name: 'GPT-3.5 Turbo',
            description: 'Fast and efficient model',
            capabilities: ['text', 'code'],
            contextLength: 16385,
            recommended: false
          }
        ]
      },
      google: {
        name: 'Google Gemini',
        models: [
          {
            id: 'gemini-1.5-pro',
            name: 'Gemini 1.5 Pro',
            description: 'Most capable model with 2M context window',
            capabilities: ['text', 'vision', 'code', 'audio'],
            contextLength: 2000000,
            recommended: true
          },
          {
            id: 'gemini-1.5-flash',
            name: 'Gemini 1.5 Flash',
            description: 'Fast model with 1M context window',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 1000000,
            recommended: false
          },
          {
            id: 'gemini-1.5-flash-8b',
            name: 'Gemini 1.5 Flash-8B',
            description: 'Lightweight and fast model',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 1000000,
            recommended: false
          },
          {
            id: 'gemini-2.0-flash-exp',
            name: 'Gemini 2.0 Flash (Experimental)',
            description: 'Next-generation experimental model',
            capabilities: ['text', 'vision', 'code', 'audio'],
            contextLength: 1000000,
            recommended: false,
            experimental: true
          }
        ]
      },
      anthropic: {
        name: 'Anthropic Claude',
        models: [
          {
            id: 'claude-3-5-sonnet-20241022',
            name: 'Claude 3.5 Sonnet',
            description: 'Latest and most capable Claude model',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 200000,
            recommended: true
          },
          {
            id: 'claude-3-5-haiku-20241022',
            name: 'Claude 3.5 Haiku',
            description: 'Fast and efficient Claude model',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 200000,
            recommended: false
          },
          {
            id: 'claude-3-opus-20240229',
            name: 'Claude 3 Opus',
            description: 'Most capable Claude 3 model',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 200000,
            recommended: false
          },
          {
            id: 'claude-3-sonnet-20240229',
            name: 'Claude 3 Sonnet',
            description: 'Balanced performance and speed',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 200000,
            recommended: false
          },
          {
            id: 'claude-3-haiku-20240307',
            name: 'Claude 3 Haiku',
            description: 'Fast and cost-effective',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 200000,
            recommended: false
          }
        ]
      },
      azure: {
        name: 'Azure OpenAI',
        models: [
          {
            id: 'gpt-4o',
            name: 'GPT-4o (Azure)',
            description: 'Latest multimodal model on Azure',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 128000,
            recommended: true
          },
          {
            id: 'gpt-4o-mini',
            name: 'GPT-4o Mini (Azure)',
            description: 'Fast and cost-effective on Azure',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 128000,
            recommended: false
          },
          {
            id: 'gpt-4-turbo',
            name: 'GPT-4 Turbo (Azure)',
            description: 'High-performance model on Azure',
            capabilities: ['text', 'code'],
            contextLength: 128000,
            recommended: false
          },
          {
            id: 'gpt-4-vision',
            name: 'GPT-4 Vision (Azure)',
            description: 'GPT-4 with vision on Azure',
            capabilities: ['text', 'vision', 'code'],
            contextLength: 128000,
            recommended: false
          }
        ]
      }
    };

    if (provider && allModels[provider]) {
      return allModels[provider];
    }

    return allModels;
  }

  async testModelAvailability(provider: string, model: string, apiKey?: string) {
    try {
      switch (provider) {
        case 'openai':
          return await this.testOpenAIModel(model, apiKey);
        case 'google':
          return await this.testGoogleModel(model, apiKey);
        case 'anthropic':
          return await this.testAnthropicModel(model, apiKey);
        case 'azure':
          return await this.testAzureModel(model, apiKey);
        default:
          return { available: false, error: 'Unknown provider' };
      }
    } catch (error) {
      return { 
        available: false, 
        error: error.message || 'Model test failed' 
      };
    }
  }

  private async testOpenAIModel(model: string, apiKey?: string) {
    try {
      const openai = new OpenAI({ 
        apiKey: apiKey || process.env.OPENAI_API_KEY 
      });
      
      // Test with a simple completion
      await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: 'Test' }],
        max_tokens: 1
      });

      return { available: true, tested: true };
    } catch (error) {
      return { 
        available: false, 
        error: error.message,
        tested: true 
      };
    }
  }

  private async testGoogleModel(model: string, apiKey?: string) {
    try {
      const genAI = new GoogleGenerativeAI(
        apiKey || process.env.GOOGLE_API_KEY
      );
      
      const geminiModel = genAI.getGenerativeModel({ model });
      await geminiModel.generateContent('Test');

      return { available: true, tested: true };
    } catch (error) {
      return { 
        available: false, 
        error: error.message,
        tested: true 
      };
    }
  }

  private async testAnthropicModel(model: string, apiKey?: string) {
    try {
      const anthropic = new Anthropic({
        apiKey: apiKey || process.env.ANTHROPIC_API_KEY
      });

      await anthropic.messages.create({
        model,
        max_tokens: 1,
        messages: [{ role: 'user', content: 'Test' }]
      });

      return { available: true, tested: true };
    } catch (error) {
      return { 
        available: false, 
        error: error.message,
        tested: true 
      };
    }
  }

  private async testAzureModel(model: string, apiKey?: string) {
    // Azure OpenAI requires additional configuration (endpoint, deployment)
    // For now, return basic availability
    return { 
      available: true, 
      tested: false,
      note: 'Azure models require additional endpoint configuration' 
    };
  }
}