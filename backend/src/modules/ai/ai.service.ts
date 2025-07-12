import { Injectable, BadRequestException } from '@nestjs/common';
import { AnalyzeImagesDto } from './dto/ai.dto';

@Injectable()
export class AiService {
  async analyzeImages(files: Express.Multer.File[], analyzeDto: AnalyzeImagesDto) {
    if (!files || files.length < 2) {
      throw new BadRequestException('Two images are required for comparison');
    }

    // Mock AI analysis for now (will be replaced with real AI calls)
    const mockAnalysis = {
      differences: [
        {
          id: '1',
          type: 'color',
          severity: 'high',
          description: 'Primary button color differs from target design',
          coordinates: { x: 100, y: 200, width: 120, height: 40 },
          currentValue: '#3b82f6',
          targetValue: '#10b981',
        },
        {
          id: '2',
          type: 'spacing',
          severity: 'medium',
          description: 'Margin between elements is larger than target',
          coordinates: { x: 50, y: 150, width: 200, height: 20 },
          currentValue: '24px',
          targetValue: '16px',
        },
      ],
      suggestions: [
        {
          id: '1',
          type: 'css',
          description: 'Update button color to match target design',
          code: '.primary-button {\n  background-color: #10b981;\n}',
          framework: analyzeDto.framework || 'css',
          priority: 'high',
          estimatedEffort: 'quick',
        },
      ],
      confidence: 0.87,
      processedAt: new Date(),
    };

    return mockAnalysis;
  }

  async detectTechStack(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one code file is required');
    }

    // Mock tech stack detection (will be replaced with real AI analysis)
    const mockDetection = {
      framework: 'react',
      language: 'typescript',
      platform: 'web',
      confidence: 0.92,
      autoDetected: true,
      detectedFiles: files.map(file => ({
        filename: file.originalname,
        type: this.getFileType(file.originalname),
        confidence: 0.9,
      })),
    };

    return mockDetection;
  }

  async generateCode(generateCodeDto: any) {
    // Mock code generation (will be replaced with real AI calls)
    const mockCode = {
      framework: generateCodeDto.framework,
      suggestions: [
        {
          file: 'components/Button.tsx',
          code: `import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children }) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      style={{ backgroundColor: variant === 'primary' ? '#10b981' : '#6b7280' }}
    >
      {children}
    </button>
  );
};`,
          description: 'Updated button component with new color scheme',
        },
      ],
      generatedAt: new Date(),
    };

    return mockCode;
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
