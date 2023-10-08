import { InjectModel } from '@nestjs/mongoose';
import { Bot, BotDocument } from './schema/bots.schema';
import { Model } from 'mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { ShareBotDto } from './dto/share-bot.dto';
import { CopyBotDto } from './dto/copy-bot.dto';
import { BotAccessesService } from '../botAccesses/botAccesses.service';
import {
  defaultPermission,
  fullPermission,
  LEVEL_ACCESS,
} from '../botAccesses/types/types';

@Injectable()
export class BotsService {
  constructor(
    @InjectModel(Bot.name) private botModel: Model<BotDocument>,
    private readonly botAccessesService: BotAccessesService,
  ) {}

  async create(profile, createBotDto: CreateBotDto): Promise<Bot> {
    const bot = await new this.botModel({ ...createBotDto, profile }).save();

    // При создании бота, создаем доступ сразу с полным уровнем
    await this.botAccessesService.create(profile, {
      botId: bot.id,
      permission: fullPermission,
    });

    return bot;
  }

  async findOne(id: string): Promise<Bot> {
    return await this.botModel.findById(id).exec();
  }

  async findAllByUser(userId: string): Promise<Bot[] | null> {
    return this.botModel.find({ profile: userId });
  }

  async findAll(): Promise<Bot[]> {
    return await this.botModel.find().exec();
  }

  async update(
    userId: string,
    id: string,
    updateBotDto: UpdateBotDto,
  ): Promise<Bot> {
    const permission = await this.botAccessesService.getPermission(userId, id);

    // Если есть доступ только для просмотра вкладки Воронки, то нельзя редактировать
    if (permission.voronki === LEVEL_ACCESS.VIEWER) {
      throw new ForbiddenException('Недостаточно прав для редактирования бота');
    }

    await this.botModel.findByIdAndUpdate(id, updateBotDto).exec();
    return this.findOne(id);
  }

  async remove(userId: string, id: string): Promise<Bot> {
    const hasFullAccess = await this.botAccessesService.hasFullAccess(
      userId,
      id,
    );
    if (!hasFullAccess) {
      throw new ForbiddenException('Недостаточно прав для удаления бота');
    }
    return await this.botModel.findByIdAndRemove(id).exec();
  }

  async copy(
    profile: string,
    id: string,
    copyBotDto: CopyBotDto,
  ): Promise<Bot> {
    const { icon, botName, botSettings } = await this.findOne(id);
    return await this.create(profile, {
      icon,
      botName,
      messenger: copyBotDto.messenger,
      botSettings,
    });
  }

  async share(
    profile: string,
    id: string,
    shareBotDto: ShareBotDto,
  ): Promise<string> {
    // создаем первичный уровень доступа
    await this.botAccessesService.shareAccess(profile, id, {
      email: shareBotDto.email,
      permission: defaultPermission,
    });

    return 'Запрос на предоставление доступа отправлен';
  }
}
