import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BotAccess, Permission } from './shema/botAccesses.shema';
import { ProfilesService } from '../profiles/profiles.service';
import { CreateBotAccessDto } from './dto/create-bot-access.dto';
import { UpdateBotAccessDto } from './dto/update-bot-access.dto';
import { ShareBotAccessDto } from './dto/share-bot-access.dto';
import { fullPermission } from './types/types';

@Injectable()
export class BotAccessesService {
  constructor(
    @InjectModel(BotAccess.name) private access: Model<BotAccess>,
    private readonly profileService: ProfilesService,
  ) {}

  async create(
    userId,
    createBotAccessDto: CreateBotAccessDto,
  ): Promise<BotAccess> {
    const botAccess = await this.access.create({
      ...createBotAccessDto,
      userId,
    });
    return botAccess.save();
  }

  async findOne(id): Promise<BotAccess> {
    const access = await this.access.findById(id).exec();

    if (!access) {
      throw new NotFoundException('Данного доступа нет');
    }

    return access;
  }

  async delete(ownerId: string, botAccessId: string): Promise<BotAccess> {
    const botAccess = await this.findOne(botAccessId);
    const hasFullAccess = await this.hasFullAccess(ownerId, botAccess.botId);

    if (!hasFullAccess) {
      throw new ForbiddenException('Недостаточно прав удалять доступ к боту');
    }

    return await botAccess.deleteOne();
  }

  async findOneByUserAndBotIds(userId, botId): Promise<BotAccess> {
    return await this.access.findOne({ userId, botId }).exec();
  }

  async findAll(): Promise<BotAccess[]> {
    return await this.access.find().exec();
  }

  async getPermission(userId, botId): Promise<Permission> {
    const botAccess = await this.findOneByUserAndBotIds(userId, botId);
    if (!botAccess) {
      throw new NotFoundException('У данного пользователя нет доступа к боту');
    }
    return botAccess.permission;
  }

  async hasFullAccess(userId, botId): Promise<boolean> {
    const permission = await this.getPermission(userId, botId);
    return JSON.stringify(permission) === JSON.stringify(fullPermission);
  }

  async isThereAnyAccess(userId, botId): Promise<boolean> {
    const botAccess = await this.findOneByUserAndBotIds(userId, botId);
    return botAccess ? true : false;
  }

  async updateAccess(
    ownerId,
    botAccessId,
    updateBotAccessDto: UpdateBotAccessDto,
  ): Promise<BotAccess> {
    const botAccess = await this.findOne(botAccessId);
    const hasFullAccess = await this.hasFullAccess(ownerId, botAccess.botId);

    if (!hasFullAccess) {
      throw new ForbiddenException(
        'Недостаточно прав редактировать доступ к боту',
      );
    }
    await botAccess.updateOne(updateBotAccessDto);
    return this.findOne(botAccessId);
  }

  async shareAccess(
    ownerId,
    botId,
    shareBotAccessDto: ShareBotAccessDto,
  ): Promise<BotAccess> {
    const hasFullAccess = await this.hasFullAccess(ownerId, botId);

    if (!hasFullAccess) {
      throw new ForbiddenException(
        'Недостаточно прав предоставлять доступ к боту',
      );
    }

    const user = await this.profileService.findByEmail(shareBotAccessDto.email);

    if (!user) {
      throw new NotFoundException(
        'Можно предоставить доступ только зарегистрированному пользователю',
      );
    }

    const isThereAccess = await this.isThereAnyAccess(user.id, botId);

    if (isThereAccess) {
      throw new ConflictException(
        'Доступ уже существует, вы можете обновить существующий доступ',
      );
    }

    return await this.create(user.id, {
      botId,
      permission: shareBotAccessDto.permission,
    });
  }
}
