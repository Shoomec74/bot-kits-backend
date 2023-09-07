import { Controller, Get, Post, Header, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('create')
  @Header('Content-Type', 'application/json')
  create(@Body() createNotificationDto: CreateNotificationDto) {
    this.notificationService.create(createNotificationDto);
  }

  @Get('all')
  getAll() {
    return this.notificationService.findAll();
  }
}
