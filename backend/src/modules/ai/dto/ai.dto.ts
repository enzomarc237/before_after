import { IsString, IsOptional, IsEnum } from 'class-validator';

export class AnalyzeImagesDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  framework?: string;

  @IsOptional()
  @IsEnum(['openai', 'google', 'anthropic', 'azure'])
  aiProvider?: 'openai' | 'google' | 'anthropic' | 'azure';

  @IsOptional()
  @IsString()
  aiModel?: string;

  @IsOptional()
  @IsString()
  apiKey?: string;
}

export class DetectStackDto {
  @IsOptional()
  @IsString()
  projectId?: string;
}

export class GenerateCodeDto {
  @IsString()
  framework: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  targetElement?: string;

  @IsOptional()
  differences?: any[];
}