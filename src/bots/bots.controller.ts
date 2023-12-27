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
import { BotCreateRequestBody } from './sdo/request-body.sdo';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateBotDto } from './dto/update-bot.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CopyBotDto } from './dto/copy-bot.dto';

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
  async findUserBots(@Req() req): Promise<Bot[]> {
    return await this.botsService.findAllByUser(req.user.id);
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

  @Get('templates')
  @ApiOperation({
    summary: 'Получить все шаблоны бота',
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

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('template')
  @ApiOperation({
    summary: 'Добавление шаблона бота админом',
  })
  @ApiOkResponse({
    description: 'Созданный шаблон',
    type: Bot,
  })
  @ApiBody({ type: CreateTemplateDto })
  createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    return this.botsService.addBotTemplate(createTemplateDto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch('template/:id')
  @ApiOperation({
    summary: 'Обновление шаблона бота админом',
  })
  @ApiOkResponse({
    description: 'Обновленны шаблон бгота',
    type: Bot,
  })
  @ApiBody({ type: UpdateTemplateDto })
  updateTemplate(
    @Param('id') templateId: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.botsService.updateTemplate(templateId, updateTemplateDto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete('template/:id')
  @ApiOperation({
    summary: 'Удаление шаблона бота',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор шаблона',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Шаблон удален',
    type: Bot,
  })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  removeTemplate(@Param('id') templateId: string): Promise<Bot> {
    return this.botsService.removeTemplate(templateId);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('template/:id')
  @ApiOperation({
    summary: 'Получение шаблона бота по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор шаблона',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Шаблон найден',
    type: Bot,
  })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  getTemplateById(@Param('id') templateId: string): Promise<Bot> {
    return this.botsService.findOne(templateId);
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
  findOneById(@Param('id') id: string): Promise<Bot> {
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

  @Post(':id')
  @ApiOperation({
    summary: 'Создание нового бота из шаблона',
  })
  @ApiCreatedResponse({
    description: 'Новый бот создан',
    type: Bot,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: BotCreateRequestBody })
  createBotsFromTemplate(
    @Req() req,
    @Body() createBotDto: CreateBotDto,
    @Param('id') id: string,
  ): Promise<Bot> {
    return this.botsService.create(req.user.id, createBotDto, id);
  }

  @Post('copy/:id')
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
  copyBot(
    @Req() req,
    @Param('id') botId: string,
    @Body() copyBotDto: CopyBotDto,
  ) {
    return this.botsService.copyBot(req.user.id, botId, copyBotDto);
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

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить бота',
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
    @Param('id') botId: string,
    @Body() updateBotDto: UpdateBotDto,
  ): Promise<Bot> {
    return this.botsService.update(req.user.id, botId, updateBotDto);
  }
}
