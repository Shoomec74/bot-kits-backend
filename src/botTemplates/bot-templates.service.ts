import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';

import { BotTemplate } from './schema/bot-template.schema';
import UpdateBotTemplateDto from './dto/update.bot-template.dto';
import CreateBotTemplateDto from './dto/create.bot-template.dto';

@Injectable()
export class BotTemplatesService {
  constructor(
    @InjectModel(BotTemplate.name)
    private readonly botTemplateModel: Model<BotTemplate>,
  ) {}

  async create(
    createBotTemplateDto: CreateBotTemplateDto,
  ): Promise<BotTemplate> {
    const botTemplate = await this.botTemplateModel.create(
      createBotTemplateDto,
    );
    return await botTemplate.save();
  }

  async update(
    id: string,
    updateBotTemplateDto: UpdateBotTemplateDto,
  ): Promise<BotTemplate> {
    try {
      const result = await this.botTemplateModel
        .findByIdAndUpdate(id, updateBotTemplateDto, { new: true })
        .exec();
      if (!result) throw new NotFoundException();
      return result;
    } catch (e) {
      if (e instanceof Error.CastError)
        throw new BadRequestException('Invalid resource id');
      throw e;
    }
  }

  async findAll(): Promise<BotTemplate[]> {
    return await this.botTemplateModel.find().exec();
  }

  async findById(id: string) {
    try {
      const result = await this.botTemplateModel.findById(id).exec();
      if (!result) throw new NotFoundException();
      return result;
    } catch (e) {
      if (e instanceof Error.CastError)
        throw new BadRequestException('Invalid resource id');
      throw e;
    }
  }
}
