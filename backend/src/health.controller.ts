import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    try {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'BeforeAfterUI Backend',
        version: '0.1.0',
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('ping')
  ping() {
    return { message: 'pong' };
  }
}