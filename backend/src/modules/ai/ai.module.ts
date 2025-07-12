import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiModelsController } from './ai-models.controller';
import { AiModelsService } from './ai-models.service';
import { OpenAIProvider } from './providers/openai.provider';
import { GoogleProvider } from './providers/google.provider';
import { AnthropicProvider } from './providers/anthropic.provider';

@Module({
  controllers: [AiController, AiModelsController],
  providers: [
    AiService,
    AiModelsService,
    OpenAIProvider,
    GoogleProvider,
    AnthropicProvider,
  ],
  exports: [AiService, AiModelsService],
})
export class AiModule {}