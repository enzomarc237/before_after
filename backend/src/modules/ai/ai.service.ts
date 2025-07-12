import { Injectable, BadRequestException } from '@nestjs/common';
import { AnalyzeImagesDto } from './dto/ai.dto';
import { OpenAIProvider } from './providers/openai.provider';
import { GoogleProvider } from './providers/google.provider';
import { AnthropicProvider } from './providers/anthropic.provider';

@Injectable()
export class AiService {
  constructor(
    private readonly openaiProvider: OpenAIProvider,
    private readonly googleProvider: GoogleProvider,
    private readonly anthropicProvider: AnthropicProvider,
  ) {}
  async analyzeImages(files: Express.Multer.File[], analyzeDto: AnalyzeImagesDto) {
    if (!files || files.length < 2) {
      throw new BadRequestException('Two images are required for comparison');
    }

    const [currentImage, targetImage] = files;
    const provider = analyzeDto.aiProvider || 'openai';

    try {
      let result;
      
      switch (provider) {
        case 'openai':
          result = await this.openaiProvider.analyzeImages(
            currentImage.buffer,
            targetImage.buffer,
            analyzeDto.framework,
            analyzeDto.aiModel,
            analyzeDto.apiKey
          );
          break;
        case 'google':
          result = await this.googleProvider.analyzeImages(
            currentImage.buffer,
            targetImage.buffer,
            analyzeDto.framework,
            analyzeDto.aiModel,
            analyzeDto.apiKey
          );
          break;
        case 'anthropic':
          result = await this.anthropicProvider.analyzeImages(
            currentImage.buffer,
            targetImage.buffer,
            analyzeDto.framework,
            analyzeDto.aiModel,
            analyzeDto.apiKey
          );
          break;
        default:
          throw new BadRequestException(`Unsupported AI provider: ${provider}`);
      }

      return {
        ...result,
        provider,
        model: analyzeDto.aiModel,
        processedAt: new Date(),
      };

    } catch (error) {
      console.error('AI analysis error:', error);
      
      // Fallback to mock response if AI fails
      return {
        differences: [
          {
            id: '1',
            type: 'error',
            severity: 'high',
            description: `AI analysis failed: ${error.message}. Using fallback analysis.`,
            coordinates: { x: 0, y: 0, width: 100, height: 100 },
            currentValue: 'Unable to analyze',
            targetValue: 'Unable to analyze',
          }
        ],
        suggestions: [
          {
            id: '1',
            type: 'manual',
            description: 'Please review images manually and apply changes',
            code: '/* AI analysis unavailable - manual review required */',
            framework: analyzeDto.framework || 'css',
            priority: 'high',
            estimatedEffort: 'manual',
          }
        ],
        confidence: 0.0,
        provider,
        error: error.message,
        processedAt: new Date(),
      };
    }
  }

  async detectTechStack(files: Express.Multer.File[], provider: string = 'openai') {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one code file is required');
    }

    const codeFiles = files.map(file => ({
      filename: file.originalname,
      content: file.buffer.toString('utf-8')
    }));

    try {
      let result;
      
      switch (provider) {
        case 'openai':
          result = await this.openaiProvider.detectTechStack(codeFiles);
          break;
        case 'google':
          result = await this.googleProvider.detectTechStack(codeFiles);
          break;
        case 'anthropic':
          result = await this.anthropicProvider.detectTechStack(codeFiles);
          break;
        default:
          throw new BadRequestException(`Unsupported AI provider: ${provider}`);
      }

      return {
        ...result,
        provider,
        processedAt: new Date(),
      };

    } catch (error) {
      console.error('Tech stack detection error:', error);
      
      // Fallback to basic file type detection
      return {
        framework: 'unknown',
        language: 'unknown',
        platform: 'web',
        confidence: 0.1,
        autoDetected: false,
        detectedFiles: files.map(file => ({
          filename: file.originalname,
          type: this.getFileType(file.originalname),
          confidence: 0.5,
        })),
        provider,
        error: error.message,
        processedAt: new Date(),
      };
    }
  }

  async generateCode(generateCodeDto: any) {
    const provider = generateCodeDto.aiProvider || 'openai';

    try {
      let result;
      
      switch (provider) {
        case 'openai':
          result = await this.openaiProvider.generateCode(generateCodeDto);
          break;
        case 'google':
          result = await this.googleProvider.generateCode(generateCodeDto);
          break;
        case 'anthropic':
          result = await this.anthropicProvider.generateCode(generateCodeDto);
          break;
        default:
          throw new BadRequestException(`Unsupported AI provider: ${provider}`);
      }

      return {
        ...result,
        provider,
        generatedAt: new Date(),
      };

    } catch (error) {
      console.error('Code generation error:', error);
      
      // Fallback to basic code template
      return {
        framework: generateCodeDto.framework,
        suggestions: [
          {
            file: 'components/Component.tsx',
            code: `// AI code generation failed: ${error.message}
// Please implement manually based on requirements`,
            description: 'Manual implementation required',
            type: 'error'
          }
        ],
        dependencies: [],
        notes: 'AI code generation unavailable - manual implementation required',
        provider,
        error: error.message,
        generatedAt: new Date(),
      };
    }
  }

  private getFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    const typeMap: Record<string, string> = {
      'tsx': 'react-component',
      'ts': 'typescript',
      'jsx': 'react-component',
      'js': 'javascript',
      'vue': 'vue-component',
      'dart': 'flutter',
      'swift': 'ios',
      'kt': 'android',
    };
    return typeMap[extension || ''] || 'unknown';
  }
}
