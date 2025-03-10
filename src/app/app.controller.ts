import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Flip')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('flip')
  @ApiOperation({ summary: 'flip check' })
  getHello(): string {
    return this.appService.runningCheck();
  }
}
