import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GoogleProvider {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn('Google API key not provided - Google AI features will be unavailable');
    }
  }

  async analyzeImages(currentImageBuffer: Buffer, targetImageBuffer: Buffer, framework?: string, model?: string, apiKey?: string) {
    try {
      // Use provided API key or fallback to environment variable
      const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : this.genAI;
      
      if (!genAI) {
        throw new Error('Google API key not provided');
      }

      const geminiModel = genAI.getGenerativeModel({ model: model || 'gemini-1.5-pro' });

      const prompt = `You are a UI/UX expert. Compare these two images: the first is the current UI, the second is the target design.

Analyze the differences and provide a JSON response with:
1. Specific differences (layout, colors, typography, spacing, components)
2. Code suggestions to transform the current UI to match the target
3. Priority and effort estimates

${framework ? `The project uses ${framework} framework. Provide framework-specific code suggestions.` : ''}

Return JSON format:
{
  "differences": [
    {
      "type": "color|spacing|typography|layout|component",
      "severity": "high|medium|low", 
      "description": "detailed description",
      "currentValue": "current state",
      "targetValue": "target state"
    }
  ],
  "suggestions": [
    {
      "type": "css|component|layout|styling",
      "description": "what to change",
      "code": "actual code snippet",
      "framework": "${framework || 'css'}",
      "priority": "high|medium|low",
      "estimatedEffort": "quick|moderate|complex"
    }
  ],
  "confidence": 0.85
}`;

      const currentImagePart = {
        inlineData: {
          data: currentImageBuffer.toString('base64'),
          mimeType: 'image/jpeg'
        }
      };

      const targetImagePart = {
        inlineData: {
          data: targetImageBuffer.toString('base64'),
          mimeType: 'image/jpeg'
        }
      };

      const result = await geminiModel.generateContent([prompt, currentImagePart, targetImagePart]);
      const response = await result.response;
      const text = response.text();

      // Try to parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback response
      return {
        differences: [
          {
            type: 'analysis',
            severity: 'medium',
            description: text.substring(0, 200) + '...',
            currentValue: 'Current UI state',
            targetValue: 'Target design state'
          }
        ],
        suggestions: [
          {
            type: 'general',
            description: 'Review the detailed analysis and apply suggested changes',
            code: '/* See detailed analysis above */',
            framework: framework || 'css',
            priority: 'medium',
            estimatedEffort: 'moderate'
          }
        ],
        confidence: 0.7,
        rawAnalysis: text
      };

    } catch (error) {
      console.error('Google AI analysis error:', error);
      throw new Error(`Google AI analysis failed: ${error.message}`);
    }
  }

  async detectTechStack(codeFiles: { filename: string; content: string }[], model?: string, apiKey?: string) {
    try {
      // Use provided API key or fallback to environment variable
      const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : this.genAI;
      
      if (!genAI) {
        throw new Error('Google API key not provided');
      }
      
      const geminiModel = genAI.getGenerativeModel({ model: model || 'gemini-2.0-flash' });

      const codeAnalysis = codeFiles.map(file => 
        `File: ${file.filename}\n\`\`\`\n${file.content.substring(0, 2000)}\n\`\`\``
      ).join('\n\n');

      const prompt = `Analyze these code files and detect the technology stack. Return JSON:
      {
        "framework": "react|vue|angular|svelte|flutter|react-native|swift|kotlin",
        "language": "typescript|javascript|dart|swift|kotlin|java",
        "platform": "web|mobile|desktop",
        "confidence": 0.95,
        "autoDetected": true,
        "detectedFiles": [
          {
            "filename": "file.tsx",
            "type": "react-component",
            "confidence": 0.9
          }
        ],
        "reasoning": "Brief explanation"
      }
      
      Code files:
      ${codeAnalysis}`;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Failed to parse tech stack detection response');

    } catch (error) {
      console.error('Google AI tech stack detection error:', error);
      throw new Error(`Tech stack detection failed: ${error.message}`);
    }
  }

  async generateCode(options: {
    framework: string;
    description: string;
    targetElement?: string;
    differences?: any[];
  }, model?: string, apiKey?: string) {
    try {
      // Use provided API key or fallback to environment variable
      const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : this.genAI;
      
      if (!genAI) {
        throw new Error('Google API key not provided');
      }
      
      const geminiModel = genAI.getGenerativeModel({ model: model || 'gemini-2.0-flash' });
      const { framework, description, targetElement, differences } = options;

      const prompt = `Generate ${framework} code for: ${description}
      ${targetElement ? `Target Element: ${targetElement}` : ''}
      ${differences ? `\nDifferences:\n${JSON.stringify(differences, null, 2)}` : ''}

      Return JSON:
      {
        "framework": "${framework}",
        "suggestions": [
          {
            "file": "component/file/path",
            "code": "actual code here",
            "description": "what this code does",
            "type": "component|style|config"
          }
        ],
        "dependencies": ["any new dependencies"],
        "notes": "implementation guidance"
      }`;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Failed to parse code generation response');

    } catch (error) {
      console.error('Google AI code generation error:', error);
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }
}