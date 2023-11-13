import {
  Controller,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Headers,
  Post,
  Query,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Profile } from './schema/profile.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { Account } from 'src/accounts/schema/account.schema';
import {
  AddUserResponseBodyNotOK,
  AddUserResponseBodyOK,
  UserProfileResponseBodyOK,
} from './sdo/response-body.sdo';
import { SingleAccountResponseBodyOK } from 'src/accounts/sdo/response-body.sdo';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AddUserRequestBody } from './sdo/request-body.sdo';
import { CombinedDto } from 'src/auth/dto/combined.dto';
import TypeAccount from 'src/accounts/types/type-account';
import { AuthDtoPipe } from 'src/auth/pipe/auth-dto.pipe';

@UseGuards(JwtGuard)
@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly authDtoPipe: AuthDtoPipe,
  ) {}
  @ApiOkResponse({
    description: 'Профили успешно получены',
    type: [UserProfileResponseBodyOK],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiOperation({
    summary: 'Получить все профили',
  })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  findAll(): Promise<Profile[]> {
    return this.profilesService.findAll();
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить текущий профиль',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Access токен',
    required: true,
  })
  @ApiOkResponse({
    description: 'Профиль успешно получен',
    type: UserProfileResponseBodyOK,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  async findProfileByToken(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return await this.profilesService.findByToken(token);
  }

  @ApiOperation({
    summary: 'Получить профиль по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Профиль успешно получен',
    type: UserProfileResponseBodyOK,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Profile> {
    const profile = await this.profilesService.findOne(id);
    if (!profile) throw new BadRequestException('Ресурс не найден');
    return profile;
  }

  @Get(':id/accounts')
  @ApiOkResponse({
    description: 'Аккаунты профиля успешно получены',
    type: [SingleAccountResponseBodyOK],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Получить все аккаунты пользователя по id профиля',
  })
  async findAccountByProfileId(@Param('id') id: string): Promise<Account[]> {
    return await this.profilesService.findAccountsByProfileId(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Профиль успешно обновлен',
    type: UserProfileResponseBodyOK,
  })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Обновить данные профиля по id',
  })
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Профиль успешно удален',
    type: UserProfileResponseBodyOK,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор профиля',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Удалить профиль по id',
  })
  remove(@Param('id') id: string): Promise<Profile> {
    return this.profilesService.remove(id);
  }

  @Post('add')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Добавление пользователя' })
  @ApiBody({ type: AddUserRequestBody })
  @ApiCreatedResponse({
    description: 'Успешная добавление пользователя',
    type: AddUserResponseBodyOK,
  })
  @ApiBadRequestResponse({ description: 'Некорректные данные' })
  @ApiConflictResponse({
    description: 'Аккаунт уже существует',
    type: AddUserResponseBodyNotOK,
  })
  async addUser(
    @Body() combinedDto: CombinedDto,
    @Query('ref') ref: string,
  ): Promise<Account> {
    const newAccount: CombinedDto = {
      email: combinedDto.email,
      password: combinedDto.password,
      username: combinedDto.username,
      phone: combinedDto.phone,
      avatar: combinedDto.avatar,
    };
    const authDto = this.authDtoPipe.transform(newAccount, {
      type: 'body',
      data: 'combinedDto',
    });
    return await this.profilesService.addUser(authDto, TypeAccount.LOCAL, ref);
  }
}
