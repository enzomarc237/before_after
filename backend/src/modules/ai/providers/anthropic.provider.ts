import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AnthropicProvider {
  private anthropic: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      this.anthropic = new Anthropic({ apiKey });
    } else {
      console.warn('Anthropic API key not provided - Anthropic features will be unavailable');
    }
  }

  async analyzeImages(currentImageBuffer: Buffer, targetImageBuffer: Buffer, framework?: string) {
    try {
      const currentImageBase64 = currentImageBuffer.toString('base64');
      const targetImageBase64 = targetImageBuffer.toString('base64');

      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are a UI/UX expert. Compare these two images: the first is the current UI, the second is the target design.

Analyze the differences and provide:
1. Specific differences (layout, colors, typography, spacing, components)
2. Code suggestions to transform the current UI to match the target
3. Priority level for each change (high, medium, low)
4. Estimated effort (quick, moderate, complex)

${framework ? `The project uses ${framework} framework. Provide framework-specific code suggestions.` : ''}

Return the response as a JSON object with this structure:
{
  "differences": [
    {
      "type": "color|spacing|typography|layout|component",
      "severity": "high|medium|low",
      "description": "detailed description",
      "currentValue": "current state",
      "targetValue": "target state",
      "coordinates": {"x": 0, "y": 0, "width": 0, "height": 0}
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
}`
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: currentImageBase64
                }
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: targetImageBase64
                }
              }
            ]
          }
        ]
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Anthropic');
      }

      // Try to parse JSON response
      try {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response, using fallback');
      }

      // Fallback response if JSON parsing fails
      return {
        differences: [
          {
            type: 'analysis',
            severity: 'medium',
            description: content.text.substring(0, 200) + '...',
            currentValue: 'Current UI state',
            targetValue: 'Target design state',
            coordinates: { x: 0, y: 0, width: 100, height: 100 }
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
        rawAnalysis: content.text
      };

    } catch (error) {
      console.error('Anthropic analysis error:', error);
      throw new Error(`Anthropic analysis failed: ${error.message}`);
    }
  }

  async detectTechStack(codeFiles: { filename: string; content: string }[]) {
    try {
      const codeAnalysis = codeFiles.map(file => 
        `File: ${file.filename}\n\`\`\`\n${file.content.substring(0, 2000)}\n\`\`\``
      ).join('\n\n');

      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Analyze these code files and detect the technology stack. Return a JSON object with:
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
              "reasoning": "Brief explanation of detection"
            }
            
            Code files:
            ${codeAnalysis}`
          }
        ]
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Anthropic');
      }

      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Failed to parse tech stack detection response');

    } catch (error) {
      console.error('Anthropic tech stack detection error:', error);
      throw new Error(`Tech stack detection failed: ${error.message}`);
    }
  }

  async generateCode(options: {
    framework: string;
    description: string;
    targetElement?: string;
    differences?: any[];
  }) {
    try {
      const { framework, description, targetElement, differences } = options;

      const prompt = `Generate ${framework} code to implement the following changes:

Description: ${description}
${targetElement ? `Target Element: ${targetElement}` : ''}
${differences ? `\nDifferences to address:\n${JSON.stringify(differences, null, 2)}` : ''}

Provide practical, working code that can be directly implemented. Include:
1. Component code (if applicable)
2. Styling (CSS/styled-components/etc.)
3. Any necessary imports or dependencies
4. Brief implementation notes

Return as JSON:
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
  "dependencies": ["any new dependencies needed"],
  "notes": "implementation guidance"
}`;

      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Anthropic');
      }

      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Failed to parse code generation response');

    } catch (error) {
      console.error('Anthropic code generation error:', error);
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }
}