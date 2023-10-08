import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
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

import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

import { PlatformService } from './platforms.service';
import { Platform } from './schema/platforms.schema';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';

@UseGuards(JwtGuard)
@ApiTags('platforms')
@ApiBearerAuth()
@Controller('platforms')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @ApiBody({ type: CreatePlatformDto })
  @ApiCreatedResponse({
    description: 'Платформа успешно создана',
    type: Platform,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiOperation({
    summary: 'Создать новую платформу',
  })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createPlatformDto: CreatePlatformDto): Promise<Platform> {
    return this.platformService.create(createPlatformDto);
  }

  @ApiOkResponse({
    description: 'Платформы успешно получены',
    type: [Platform],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiOperation({
    summary: 'Получить все платформы',
  })
  @Get()
  findAll(): Promise<Platform[]> {
    return this.platformService.findAll();
  }

  @ApiOkResponse({
    description: 'Платформа успешно получена',
    type: Platform,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiParam({
    name: 'id',
    description: 'Идентиификатор платформы',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Получить платформу по id',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Platform> {
    const platform = await this.platformService.findOne(id);
    if (!platform) throw new BadRequestException('Ресурс не найден');
    return platform;
  }

  @ApiOkResponse({
    description: 'Платформа успешно обновлена',
    type: Platform,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: UpdatePlatformDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор платформы',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Обновить данные о платформе по id',
  })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlatformDto: UpdatePlatformDto,
  ): Promise<Platform> {
    return this.platformService.update(id, updatePlatformDto);
  }

  @ApiOkResponse({
    description: 'Платформа успешно удалена',
    type: Platform,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор платформы',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Удалить платформу по id',
  })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Platform> {
    return this.platformService.remove(id);
  }
}
