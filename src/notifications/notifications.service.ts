import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';

import { Notification } from './schema/notifications.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import UpdateNotificationDto from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const newNotification = new this.notificationModel(createNotificationDto);
    return newNotification.save();
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findbyId(id: string): Promise<Notification> {
    try {
      const res: Notification = await this.notificationModel.findById(id);
      if (!res) throw new NotFoundException();
      return res;
    } catch (err) {
      if (err instanceof Error.CastError)
        throw new BadRequestException('Invalid resource id');
      throw err;
    }
  }

  async remove(id: string): Promise<Notification> {
    return await this.notificationModel.findByIdAndRemove(id).exec();
  }

  async update(updateNotificationDto: UpdateNotificationDto, id: string) {
    try {
      const res = await this.notificationModel
        .findByIdAndUpdate(id, updateNotificationDto, { new: true })
        .exec();
      if (!res) throw new NotFoundException();
      return res;
    } catch (err) {
      if (err instanceof Error.CastError)
        throw new BadRequestException('Invalid resource id');
      throw err;
    }
  }
}
