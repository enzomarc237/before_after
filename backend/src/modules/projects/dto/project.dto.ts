import { IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TechStackDto {
  @IsString()
  framework: string;

  @IsString()
  language: string;

  @IsEnum(['web', 'mobile', 'desktop'])
  platform: 'web' | 'mobile' | 'desktop';

  @IsOptional()
  autoDetected?: boolean;

  @IsOptional()
  confidence?: number;
}

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TechStackDto)
  techStack?: TechStackDto;

  @IsOptional()
  @IsEnum(['active', 'completed', 'archived'])
  status?: 'active' | 'completed' | 'archived' = 'active';
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TechStackDto)
  techStack?: TechStackDto;

  @IsOptional()
  @IsEnum(['active', 'completed', 'archived'])
  status?: 'active' | 'completed' | 'archived';
}