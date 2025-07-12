import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { OpenAIProvider } from './providers/openai.provider';
import { GoogleProvider } from './providers/google.provider';
import { AnthropicProvider } from './providers/anthropic.provider';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    OpenAIProvider,
    GoogleProvider,
    AnthropicProvider,
  ],
  exports: [AiService],
})
export class AiModule {}