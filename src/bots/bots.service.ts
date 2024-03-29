import { Bot } from './schema/bots.schema';
import { ConflictException, Injectable, StreamableFile } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { BotsRepository } from './bots.repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CopyBotDto } from './dto/copy-bot.dto';
import { FilesBucketService } from 'src/gridFS/gridFS.service';
import { PureAbility } from '@casl/ability';
import { Profile } from 'src/profiles/schema/profile.schema';
import axios from 'axios';

@Injectable()
export class BotsService {
  constructor(
    private dbQuery: BotsRepository,
    private gridFS: FilesBucketService,
  ) {}

  async uploadFiles(
    files: Array<Express.Multer.File>,
    botId: string,
    nodeId: string,
  ) {
    //todo: сделать добавление attachment'ов к боту
    try {
      const fileId = await this.gridFS.filesUpload(files);
      //-- TODO: сейчас всегда с фронта приходит один файл. В будущем если такое нужно будет можно реализовать мультизагрузку файлов --//
      return await this.dbQuery.updateNodeBots(fileId[0], botId, nodeId);
    } catch (e) {
      return e;
    }
  }

  async downloadFile(id: string): Promise<StreamableFile> {
    //todo: сделать добавление attachment'ов к боту
    try {
      return await this.gridFS.filesDownload(id);
    } catch (e) {
      return e;
    }
  }

  async deleteFile(fileId: string, botId: string, nodeId: string) {
    //todo: сделать добавление attachment'ов к боту
    try {
      await this.gridFS.filesDelete(fileId);

      return await this.dbQuery.deleteFileNodeBot(fileId, botId, nodeId);
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async create(
    profile,
    createBotDto: CreateBotDto,
    ability: PureAbility,
    id?: string,
  ): Promise<Bot> {
    try {
      return await this.dbQuery.create(profile, createBotDto, ability, id);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Бот с таким имененм уже существует');
      } else {
        return e;
      }
    }
  }

  async findOne(id: string): Promise<Bot> {
    try {
      return await this.dbQuery.findOne(id);
    } catch (e) {
      return e;
    }
  }

  async findOneBotWithAccess(id: string, userId: Profile): Promise<Bot> {
    try {
      return await this.dbQuery.findOneBotWithAccess(id, userId);
    } catch (e) {
      return e;
    }
  }

  async findAllByUser(userId: string): Promise<Bot[] | null> {
    try {
      return this.dbQuery.findAllByUserNew(userId);
    } catch (e) {
      return e;
    }
  }

  async findAll(): Promise<Bot[]> {
    try {
      return await this.dbQuery.findAll();
    } catch (e) {
      return e;
    }
  }

  async findAllTemplates(): Promise<Bot[]> {
    try {
      return await this.dbQuery.findAllTemplates();
    } catch (e) {
      return e;
    }
  }

  async update(
    botId: string,
    updateBotDto: UpdateBotDto,
    ability: PureAbility,
  ): Promise<Bot> {
    try {
      return this.dbQuery.update(botId, updateBotDto, ability);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Бот с таким имененм уже существует');
      } else {
        return e;
      }
    }
  }

  async remove(userId: string, id: string, ability: PureAbility): Promise<Bot> {
    try {
      return await this.dbQuery.remove(userId, id, ability);
    } catch (e) {
      return e;
    }
  }

  async addBotTemplate(createTemplateDto: CreateTemplateDto): Promise<Bot> {
    try {
      return await this.dbQuery.createTemplate(createTemplateDto);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Шаблон с таким имененм уже существует');
      } else {
        return e;
      }
    }
  }

  async updateTemplate(
    templateId: string,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<Bot> {
    try {
      return this.dbQuery.updateTemplate(templateId, updateTemplateDto);
    } catch (e) {
      return e;
    }
  }

  async removeTemplate(templateId: string): Promise<Bot> {
    try {
      return await this.dbQuery.removeTemplate(templateId);
    } catch (e) {
      return e;
    }
  }

  async copyBot(
    profileId: string,
    botId: string,
    copyBotDto: CopyBotDto,
    ability: PureAbility,
  ): Promise<Bot> {
    try {
      return await this.dbQuery.copy(profileId, botId, copyBotDto, ability);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException(
          'Переименуйте уже скопированного бота или повторите опе6рацию копирования',
        );
      } else {
        return e;
      }
    }
  }

  //-- Имитация работы с сервером заказчика и выдача статуса по запуску бота. ТРЕБУЕТ ДОРАБОТКИ --//
  //-- Лучше отправить пользователю сразу статус updating, а обновление бота на сервере кинуть в очередь задач а после обновления или ошибки по WS уведомить или обновить бота на фронте--//
  async run(botId: string, updateBotDto: UpdateBotDto, ability: PureAbility) {
    try {
      const response = await axios.post(
        'http://localhost:3005/bot/status',
        botId,
      );

      const newUpdateBotDto = { ...updateBotDto, status: response.data.status };

      return await this.dbQuery.update(botId, newUpdateBotDto, ability);
    } catch (e) {
      return e;
    }
  }
}
