import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfilesModule } from 'src/profiles/profiles.module';

import {
  Notification,
  NotificationSchema,
} from './schema/notifications.schema';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';

@Module({
  imports: [
    ProfilesModule,
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],

  controllers: [NotificationController],

  providers: [NotificationService],

  exports: [NotificationService],
})
export class NotificationModule {}
