import { Controller, Get, Query } from '@nestjs/common';
import { AiModelsService } from './ai-models.service';

@Controller('ai/models')
export class AiModelsController {
  constructor(private readonly aiModelsService: AiModelsService) {}

  @Get()
  async getAvailableModels(@Query('provider') provider?: string) {
    return this.aiModelsService.getAvailableModels(provider);
  }

  @Get('test')
  async testModelAvailability(
    @Query('provider') provider: string,
    @Query('model') model: string,
    @Query('apiKey') apiKey?: string
  ) {
    return this.aiModelsService.testModelAvailability(provider, model, apiKey);
  }
}