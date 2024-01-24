import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Promocode } from './schema/promocode.schema';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { Action } from 'src/ability/ability.factory';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';

@UseGuards(JwtGuard)
@ApiTags('promocodes')
@ApiBearerAuth()
@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @CheckAbility({ action: Action.Create, subject: CreatePromocodeDto })
  @UseGuards(AbilityGuard)
  @Post()
  @ApiOperation({
    summary: 'Добавить новый промокод',
  })
  @ApiBody({ type: CreatePromocodeDto })
  @ApiCreatedResponse({
    description: 'Промокод успешно добавлен',
    type: Promocode,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiConflictResponse({ description: 'Такой промокод уже существует' })
  create(@Body() createPromocodeDto: CreatePromocodeDto): Promise<Promocode> {
    return this.promocodesService.create(createPromocodeDto);
  }

  @CheckAbility({ action: Action.Read, subject: CreatePromocodeDto })
  @UseGuards(AbilityGuard)
  @Get()
  @ApiOperation({
    summary: 'Получить все промокоды',
  })
  @ApiOkResponse({
    description: 'Промокоды успешно получены',
    type: [Promocode],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  findAll(): Promise<Promocode[]> {
    return this.promocodesService.findAll();
  }

  @CheckAbility({ action: Action.Read, subject: UpdatePromocodeDto })
  @UseGuards(AbilityGuard)
  @Get('promocode')
  @ApiOperation({
    summary: 'Получить промокод по названию',
  })
  @ApiOkResponse({
    description: 'Промокод успешно получен',
    type: [Promocode],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  async findOneByCode(@Query('code') code: string): Promise<Promocode> {
    return this.promocodesService.findOneByCode(code);
  }

  @CheckAbility({ action: Action.Update, subject: UpdatePromocodeDto })
  @UseGuards(AbilityGuard)
  @Patch('promocode')
  @ApiOperation({
    summary: 'Использовать промокод 1 раз',
  })
  @ApiOkResponse({
    description: 'Промокод успешно обновлен',
    type: [Promocode],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  async updateByCode(
    @Query('code') code: string,
    @Req() req,
  ): Promise<Promocode> {
    return this.promocodesService.updateByCode(code, req.user.id);
  }

  @CheckAbility({ action: Action.Read, subject: UpdatePromocodeDto })
  @UseGuards(AbilityGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Получить промокод по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор промокода',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Промокод успешно получен',
    type: Promocode,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  findOne(@Param('id') id: string): Promise<Promocode> {
    return this.promocodesService.findOne(id);
  }

  @CheckAbility({ action: Action.Update, subject: CreatePromocodeDto })
  @UseGuards(AbilityGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Изменить данные промокода по id',
  })
  @ApiBody({ type: UpdatePromocodeDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор промокода',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Данные промокода успешно изменены',
    type: Promocode,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  update(
    @Param('id') id: string,
    @Body() updatePromocodeDto: UpdatePromocodeDto,
  ): Promise<Promocode> {
    return this.promocodesService.update(id, updatePromocodeDto);
  }

  @CheckAbility({ action: Action.Delete, subject: CreatePromocodeDto })
  @UseGuards(AbilityGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить промокод по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор промокода',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Промокод успешно удален',
    type: Promocode,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  remove(@Param('id') id: string): Promise<Promocode> {
    return this.promocodesService.remove(id);
  }
}
