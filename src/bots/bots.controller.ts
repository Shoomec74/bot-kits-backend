import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { BotsService } from './bots.service';
import { Bot } from './schema/bots.schema';
import { CreateBotDto } from './dto/create-bot.dto';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
import { ShareBotDto } from './dto/share-bot.dto';
import { CopyBotDto } from './dto/copy-bot.dto';
import { BotCreateRequestBody } from './sdo/request-body.sdo';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('bots')
@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить ботов пользователя',
  })
  @ApiOkResponse({
    description: 'Запрос выполнен успешно',
    type: [Bot],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  async findMy(@Req() req): Promise<Bot[]> {
    return await this.botsService.findAllByUser(req.user.id);
  }

  @Get('templates')
  @ApiOperation({
    summary: 'Получить ботов пользователя',
  })
  @ApiOkResponse({
    description: 'Запрос выполнен успешно',
    type: [Bot],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  async findTemplates(): Promise<Bot[]> {
    return await this.botsService.findAllTemplates();
  }

  @Post()
  @ApiOperation({
    summary: 'Создание нового бота',
  })
  @ApiCreatedResponse({
    description: 'Новый бот создан',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: BotCreateRequestBody })
  create(@Req() req, @Body() createBotDto: CreateBotDto): Promise<Bot> {
    return this.botsService.create(req.user.id, createBotDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удаление бота',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Бот удален',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  remove(@Req() req, @Param('id') id: string): Promise<Bot> {
    return this.botsService.remove(req.user.id, id);
  }

  @Post(':id/copy')
  @ApiOperation({
    summary: 'Копирование бота',
  })
  @ApiCreatedResponse({
    description: 'Бот скопирован',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: CopyBotDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  copy(@Req() req, @Param('id') id: string, @Body() copyBotDto: CopyBotDto) {
    return this.botsService.copy(req.user.id, id, copyBotDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Смена имени бота',
  })
  @ApiOkResponse({
    description: 'Имя бота обновлено',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBody({ type: BotCreateRequestBody })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() body: { title: 'string' },
  ): Promise<Bot> {
    return this.botsService.update(req.user.id, id, body);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить данные бота по Id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Информация о боте по Id получена',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  findOne(@Param('id') id: string): Promise<Bot> {
    return this.botsService.findOne(id);
  }

  @Post(':id/share')
  @ApiOperation({
    summary:
      'Предоставить общий доступ к боту, первичный доступ при отправке email',
  })
  @ApiCreatedResponse({
    description: 'Первичный доступ создан',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: ShareBotDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  share(
    @Req() req,
    @Param('id') id: string,
    @Body() shareBotDto: ShareBotDto,
  ): Promise<string> {
    return this.botsService.share(req.user.id, id, shareBotDto);
  }
}
