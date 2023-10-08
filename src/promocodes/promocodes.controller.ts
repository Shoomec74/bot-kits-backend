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
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtGuard)
@ApiTags('promocodes')
@ApiBearerAuth()
@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

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
  //@UseGuards(RolesGuard)
  //@Roles('admin')
  @Post()
  create(@Body() createPromocodeDto: CreatePromocodeDto): Promise<Promocode> {
    return this.promocodesService.create(createPromocodeDto);
  }

  @ApiOperation({
    summary: 'Получить все промокоды',
  })
  @ApiOkResponse({
    description: 'Промокоды успешно получены',
    type: [Promocode],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  //@UseGuards(RolesGuard)
  //@Roles('admin')
  @Get()
  findAll(): Promise<Promocode[]> {
    return this.promocodesService.findAll();
  }

  @ApiOperation({
    summary: 'Получить промокод по названию',
  })
  @ApiOkResponse({
    description: 'Промокод успешно получен',
    type: [Promocode],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @Get('promocode')
  async findOneByCode(@Query('code') code: string): Promise<Promocode> {
    return this.promocodesService.findOneByCode(code);
  }

  @ApiOperation({
    summary: 'Использовать промокод 1 раз',
  })
  @ApiOkResponse({
    description: 'Промокод успешно обновлен',
    type: [Promocode],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @Patch('promocode')
  async updateByCode(@Query('code') code: string): Promise<Promocode> {
    return this.promocodesService.updateByCode(code);
  }

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
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Promocode> {
    return this.promocodesService.findOne(id);
  }

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
  //@UseGuards(RolesGuard)
  //@Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromocodeDto: UpdatePromocodeDto,
  ): Promise<Promocode> {
    return this.promocodesService.update(id, updatePromocodeDto);
  }

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
  //@UseGuards(RolesGuard)
  //@Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Promocode> {
    return this.promocodesService.remove(id);
  }
}
