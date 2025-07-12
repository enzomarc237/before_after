import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from './modules/projects/projects.module';
import { AiModule } from './modules/ai/ai.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/beforeafterui'
    ),
    ProjectsModule,
    AiModule,
    UploadsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}