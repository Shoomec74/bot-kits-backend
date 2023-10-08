import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';

import { BlacklistTokensService } from './blacklistTokens.service';

@UseGuards(JwtGuard)
@ApiTags('logout')
@Controller()
export class BlacklistTokensController {
  constructor(
    private readonly blacklistTokensService: BlacklistTokensService,
  ) {}

  @Get('logout')
  @ApiOperation({
    summary: 'Разлогинить пользователя',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'authorization',
    description: 'Access токен',
    required: true,
  })
  @ApiOkResponse({
    description: 'Пользователь успешно разлогинен',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Сообщение об успешном разлогине',
        },
      },
    },
  })
  async addToken(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    await this.blacklistTokensService.addToken(token);
    return { message: 'Пользователь успешно разлогинен' };
  }
}
