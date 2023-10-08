import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { BotTemplatesService } from './bot-templates.service';
import { BotTemplate } from './schema/bot-template.schema';
import UpdateBotTemplateDto from './dto/update.bot-template.dto';
import CreateBotTemplateDto from './dto/create.bot-template.dto';

@ApiTags('botTemplates')
@ApiBearerAuth()
@Controller('botTemplates')
export class BotTemplatesController {
  constructor(private readonly botTemplatesService: BotTemplatesService) {}

  @ApiOkResponse({
    description: 'Шаблоны ботов успешно получены',
    type: [BotTemplate],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiOperation({
    summary: 'Список шаблонов ботов',
  })
  @Get()
  async findAll(): Promise<BotTemplate[]> {
    return await this.botTemplatesService.findAll();
  }

  @ApiOkResponse({
    description: 'Шаблон бота успешно получен',
    type: BotTemplate,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор шаблона бота',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Получить шаблон бота по id',
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<BotTemplate> {
    return this.botTemplatesService.findById(id);
  }

  @ApiCreatedResponse({
    description: 'Шаблон бота успешно создан',
    type: BotTemplate,
  })
  @ApiOperation({
    summary: 'Создать шаблон бота',
  })
  @ApiBody({ type: CreateBotTemplateDto })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @Post()
  async create(
    @Body() createBotTemplateDto: CreateBotTemplateDto,
  ): Promise<BotTemplate> {
    return await this.botTemplatesService.create(createBotTemplateDto);
  }

  @ApiOkResponse({
    description: 'Шаблон бота успешно изменен',
    type: BotTemplate,
  })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: UpdateBotTemplateDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор шаблона бота',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Изменить шаблон бота',
  })
  @Patch(':id')
  update(
    @Body() updateBotTemplateDto: UpdateBotTemplateDto,
    @Param('id') id: string,
  ): Promise<BotTemplate> {
    return this.botTemplatesService.update(id, updateBotTemplateDto);
  }
}
