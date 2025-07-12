import { Controller, Post, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';
import { AnalyzeImagesDto } from './dto/ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze')
  @UseInterceptors(FilesInterceptor('images', 2))
  async analyzeImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() analyzeDto: AnalyzeImagesDto,
  ) {
    return this.aiService.analyzeImages(files, analyzeDto);
  }

  @Post('detect-stack')
  @UseInterceptors(FilesInterceptor('codeFiles', 10))
  async detectTechStack(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.aiService.detectTechStack(files);
  }

  @Post('generate-code')
  async generateCode(@Body() generateCodeDto: any) {
    return this.aiService.generateCode(generateCodeDto);
  }
}
