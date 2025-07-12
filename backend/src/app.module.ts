import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './modules/projects/projects.module';
import { AiModule } from './modules/ai/ai.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProjectsModule,
    AiModule,
    UploadsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}