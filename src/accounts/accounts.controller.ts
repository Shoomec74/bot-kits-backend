import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

import { AccountService } from './accounts.service';
import { Account } from './schema/account.schema';
import { UpdateAccountDto } from './dto/update-account.dto';
import { SingleAccountResponseBodyOK } from './sdo/response-body.sdo';
import { AccountUpdateRequestBody } from './sdo/request-body.sdo';

@UseGuards(JwtGuard)
@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get()
  @ApiOperation({
    summary: 'Получить все аккаунты',
  })
  @ApiOkResponse({
    description: 'Запрос выполнен успешно',
    type: [SingleAccountResponseBodyOK],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll(): Promise<Account[]> {
    return this.accountService.findAll();
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Аккаунт успешно обновлен',
    type: SingleAccountResponseBodyOK,
  })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiBody({ type: AccountUpdateRequestBody })
  @ApiParam({
    name: 'id',
    description: 'Индификатор аккаунта',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOperation({
    summary: 'Обновить данные аккаунта по id',
  })
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountService.update(id, updateAccountDto);
  }
}
