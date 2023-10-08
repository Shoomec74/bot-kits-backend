import { Controller, Post, UseGuards, Req, Body, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiExcludeEndpoint,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { ProfileDocument } from 'src/profiles/schema/profile.schema';
import TypeAccount from 'src/accounts/types/type-account';
import { Account } from 'src/accounts/schema/account.schema';

import { LocalGuard } from './guards/localAuth.guard';
import { AuthService, ITokens } from './auth.service';
import { AuthDtoPipe } from './pipe/auth-dto.pipe';
import { CombinedDto } from './dto/combined.dto';
import { GoogleGuard } from './guards/google.guard';
import {
  RefreshTokenRequestBody,
  ResetPasswordRequestBody,
  SigninRequestBody,
  SignupRequestBody,
  CodeFlowAuthRequestBody,
} from './sdo/request-body.sdo';
import {
  ResetPasswordResponseBodyNotFound,
  ResetPasswordResponseBodyOK,
  SigninResponseBodyNotOK,
  SigninResponseBodyOK,
  SignupResponseBodyNotOK,
  refreshTokenResponseBodyNotOK,
  refreshTokenResponseBodyOK,
} from './sdo/response-body.sdo';
import { VkontakteGuard } from './guards/vkontakte.guards';
import { TelegramGuard } from './guards/telegram.guard';

interface RequestProfile extends Request {
  user: ProfileDocument;
}

interface CommandDto {
  chatId: number;
  text: string;
}

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly authDtoPipe: AuthDtoPipe,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  @ApiOperation({
    summary: 'Войти в систему',
  })
  @ApiBody({ type: SigninRequestBody })
  @ApiCreatedResponse({
    description: 'Успешный вход в систему',
    type: SigninResponseBodyOK,
  })
  @ApiUnauthorizedResponse({
    description: 'Неверное имя пользователя или пароль',
    type: SigninResponseBodyNotOK,
  })
  async signin(@Req() req: RequestProfile): Promise<Account> {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Регистрация' })
  @ApiBody({ type: SignupRequestBody })
  @ApiCreatedResponse({
    description: 'Успешная регистрация',
    type: SigninResponseBodyOK,
  })
  @ApiBadRequestResponse({ description: 'Некорректные данные' })
  @ApiConflictResponse({
    description: 'Аккаунт уже существует',
    type: SignupResponseBodyNotOK,
  })
  async signup(@Body() combinedDto: CombinedDto): Promise<Account> {
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
    return await this.authService.registration(authDto);
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Обновить токен',
  })
  @ApiBody({ type: RefreshTokenRequestBody })
  @ApiCreatedResponse({
    description: 'accessToken успешно обновлен',
    type: refreshTokenResponseBodyOK,
  })
  @ApiUnauthorizedResponse({
    description: 'Невалидный refreshToken',
    type: refreshTokenResponseBodyNotOK,
  })
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<ITokens> {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('yandex/exchange')
  @ApiOperation({
    summary: 'Авторизация через Yandex',
  })
  @ApiBody({
    type: CodeFlowAuthRequestBody,
  })
  @ApiCreatedResponse({
    description: 'Успешная регистрация',
    type: SigninResponseBodyOK,
  })
  async exchangeCodeYandex(@Body('codeAuth') codeAuth: string) {
    const userData = await this.authService.authYandex(codeAuth);
    const newAccount: CombinedDto = {
      email: userData.data.default_email,
      password: '',
      username: userData.data.real_name || userData.data.first_name,
      phone: userData.data.default_phone.number,
      avatar: '',
    };
    const authDto = this.authDtoPipe.transform(newAccount, {
      type: 'body',
      data: 'combinedDto',
    });
    return await this.authService.authSocial(authDto, TypeAccount.YANDEX);
  }

  @Post('mailru/exchange')
  @ApiOperation({
    summary: 'Авторизация через Mail',
  })
  @ApiBody({
    type: CodeFlowAuthRequestBody,
  })
  @ApiCreatedResponse({
    description: 'Успешная регистрация',
    type: SigninResponseBodyOK,
  })
  async exchangeCodeMail(@Body('codeAuth') codeAuth: string) {
    const userData = await this.authService.authMailru(codeAuth);

    const newAccount: CombinedDto = {
      email: userData.email,
      password: '',
      username: userData.nickname,
      phone: '',
      avatar: userData.image,
    };
    const authDto = this.authDtoPipe.transform(newAccount, {
      type: 'body',
      data: 'combinedDto',
    });
    return await this.authService.authSocial(authDto, TypeAccount.MAIL);
  }

  @UseGuards(VkontakteGuard)
  @Get('vkontakte')
  @ApiOperation({
    summary: 'Авторизация через Вконтакте',
  })
  @ApiOkResponse({
    description: 'Успешная регистрация',
    type: SigninResponseBodyOK,
  })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  vkontakteAuth() {}

  @ApiExcludeEndpoint(true)
  @UseGuards(VkontakteGuard)
  @Get('vkontakte/callback')
  async vkontakteCallback(@Req() req: any) {
    const { email, username, avatar } = req.user.profile;
    const newAccount: CombinedDto = {
      email,
      password: '',
      username,
      phone: ' ',
      avatar,
    };

    const authDto = this.authDtoPipe.transform(newAccount, {
      type: 'body',
      data: 'combinedDto',
    });
    return this.authService.authSocial(authDto, TypeAccount.VK);
  }

  @UseGuards(GoogleGuard)
  @Get('google')
  @ApiOperation({
    summary: 'Авторизация через Google',
  })
  @ApiOkResponse({
    description: 'Успешная регистрация',
    type: SigninResponseBodyOK,
  })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleAuth() {}

  @ApiExcludeEndpoint(true)
  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: any) {
    const { email, username, avatar } = req.user;
    const newAccount: CombinedDto = {
      email,
      password: '',
      username,
      phone: ' ',
      avatar,
    };
    const authDto = this.authDtoPipe.transform(newAccount, {
      type: 'body',
      data: 'combinedDto',
    });
    return this.authService.authSocial(authDto, TypeAccount.GOOGLE);
  }

  @UseGuards(TelegramGuard)
  @Post('/telegram')
  async telegramCallback(@Req() req: any) {
    const { username } = req.user;
    const newAccount: CombinedDto = {
      email: 'telegram',
      password: 'telegram',
      username,
      phone: 'telegram',
      avatar: '',
    };
    const authDto = this.authDtoPipe.transform(newAccount, {
      type: 'body',
      data: 'combinedDto',
    });
    return this.authService.authSocial(authDto, TypeAccount.TELEGRAM);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Сброс пароля',
  })
  @ApiBody({
    type: ResetPasswordRequestBody,
  })
  @ApiCreatedResponse({
    type: ResetPasswordResponseBodyOK,
    description: 'Ссылка для сброса пароля отправлена на указанный Email',
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные',
  })
  @ApiNotFoundResponse({
    type: ResetPasswordResponseBodyNotFound,
    description: 'Пользователь с указанным Email не найден',
  })
  async resetPassword(@Body('email') email: string) {
    return await this.authService.sendPasswordResetEmail(email);
  }
}
