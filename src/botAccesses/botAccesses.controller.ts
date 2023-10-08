import {
  Controller,
  Post,
  Body,
  Delete,
  Patch,
  Get,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

import { BotAccessesService } from './botAccesses.service';
import { CreateBotAccessDto } from './dto/create-bot-access.dto';
import { UpdateBotAccessDto } from './dto/update-bot-access.dto';
import { ShareBotAccessDto } from './dto/share-bot-access.dto';
import { BotAccess, Permission } from './shema/botAccesses.shema';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';

@ApiTags('botAccesses')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('bot-accesses')
export class BotAccessesController {
  constructor(private readonly botAccessesService: BotAccessesService) {}

  @Post()
  @ApiOperation({
    summary: 'Создает доступ',
    description:
      'Создает запись о доступе пользователя к боту, используется при создании бота',
  })
  @ApiCreatedResponse({
    description: 'Запись о доступе создана.',
    type: BotAccess,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: CreateBotAccessDto })
  create(
    @Req() req,
    @Body() createBotAccess: CreateBotAccessDto,
  ): Promise<BotAccess> {
    return this.botAccessesService.create(req.user.id, createBotAccess);
  }

  @Get()
  @ApiOperation({ summary: 'Найти все доступы' })
  @ApiOkResponse({
    description: 'Все доступы найдены.',
    type: [BotAccess],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() {
    return this.botAccessesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Найти доступ по ID',
    description:
      'ВАЖНО! Находит доступ по botAccessId (запись о связи botId и userId)',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор botAccessId',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Доступ найден.',
    type: BotAccess,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  findOne(@Param('id') id: string) {
    return this.botAccessesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Изменить уровень доступа',
    description:
      'Изменяет уровень существующего доступа. Должен передаваться полностью объект с теми доступами, которые должны быть у пользователя.',
  })
  @ApiOkResponse({
    description: 'Доступ изменен.',
    type: BotAccess,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: UpdateBotAccessDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор botAccessId',
    example: '64f81ba37571bfaac18a857f',
  })
  update(
    @Req() req,
    @Param('id') botAccessId: string,
    @Body() updateBotAccessDto: UpdateBotAccessDto,
  ) {
    return this.botAccessesService.updateAccess(
      req.user.id,
      botAccessId,
      updateBotAccessDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить доступ',
  })
  @ApiOkResponse({
    description: 'Доступ удален.',
    type: BotAccess,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор botAccessId',
    example: '64f81ba37571bfaac18a857f',
  })
  delete(@Req() req, @Param('id') botAccessId: string) {
    return this.botAccessesService.delete(req.user.id, botAccessId);
  }

  @Get(':userId/:botId')
  @ApiParam({
    name: 'userId',
    description: 'Идентификатор пользователя',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiParam({
    name: 'botId',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Получить доступ',
    description: 'Позвоялет проверить уровень доступа по botId и userId',
  })
  @ApiOkResponse({
    description: 'Информация о доступе по botId и userId получена.',
    schema: {
      type: 'Permission',
      //example: Permission.OWNER,
    },
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  getPermission(
    @Param('botId') botId: string,
    @Param('userId') userId: string,
  ): Promise<Permission> {
    return this.botAccessesService.getPermission(userId, botId);
  }

  @Post(':botId')
  @ApiOperation({
    summary: 'Поделиться доступом',
    description: `Позвоялет поделиться доступом по botId и создать новый доступ, если пользователь имеет полный уровень доступа к данному боту`,
  })
  @ApiCreatedResponse({
    description: 'Новый доступ создан.',
    type: BotAccess,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: ShareBotAccessDto })
  @ApiParam({
    name: 'botId',
    description: 'Идентификатор бота',
    example: '64f81ba37571bfaac18a857f',
  })
  shareAccess(
    @Req() req,
    @Param('botId') botId: string,
    @Body() shareBotAccessDto: ShareBotAccessDto,
  ) {
    return this.botAccessesService.shareAccess(
      req.user.id,
      botId,
      shareBotAccessDto,
    );
  }
}
