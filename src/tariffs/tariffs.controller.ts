import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
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

import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

import { TariffsService } from './tariffs.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { Tariff } from './schema/tariff.schema';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { Action } from 'src/ability/ability.factory';
import { AbilityGuard } from 'src/auth/guards/ability.guard';

@ApiTags('tariffs')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @CheckAbility({ action: Action.Read, subject: UpdateTariffDto })
  @UseGuards(AbilityGuard)
  @Get()
  @ApiOperation({
    summary: 'Получить все тарифы',
  })
  @ApiOkResponse({
    description: 'Тарифы успешно получены',
    type: [Tariff],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  findAllTariffs() {
    return this.tariffsService.findAll();
  }

  @CheckAbility({ action: Action.Read, subject: UpdateTariffDto })
  @UseGuards(AbilityGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Получить тариф по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор тарифа',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Тариф успешно получен',
    type: Tariff,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  findTariffToId(@Param('id') id: string) {
    return this.tariffsService.findOne(id);
  }

  @CheckAbility({ action: Action.Create, subject: CreateTariffDto })
  @UseGuards(AbilityGuard)
  @Post()
  @ApiOperation({
    summary: 'Добавить новый тариф',
  })
  @ApiBody({ type: CreateTariffDto })
  @ApiCreatedResponse({
    description: 'Тариф успешно добавлен',
    type: Tariff,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiConflictResponse({ description: 'Такой тариф уже существует' })
  createTariff(@Body() createTariffDto: CreateTariffDto) {
    return this.tariffsService.create(createTariffDto);
  }

  @CheckAbility({ action: Action.Update, subject: CreateTariffDto })
  @UseGuards(AbilityGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Изменить данные тарифа по id',
  })
  @ApiBody({ type: UpdateTariffDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор тарифа',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Тариф успешно изменен',
    type: Tariff,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  updateTariff(
    @Param('id') id: string,
    @Body() updateTariffDto: UpdateTariffDto,
  ) {
    return this.tariffsService.updateTariff(id, updateTariffDto);
  }

  @CheckAbility({ action: Action.Delete, subject: CreateTariffDto })
  @UseGuards(AbilityGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить тариф по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор тарифа',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Тариф успешно удален',
    type: Tariff,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  removeTariff(@Param('id') id: string): Promise<Tariff> {
    return this.tariffsService.remove(id);
  }
}
