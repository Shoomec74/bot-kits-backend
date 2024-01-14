import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Post,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
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
  OmitType,
} from '@nestjs/swagger';
import { Payment } from './schema/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { Profile } from 'src/profiles/schema/profile.schema';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { Action } from 'src/ability/ability.factory';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @CheckAbility({ action: Action.Read, subject: CreatePaymentDto })
  @UseGuards(AbilityGuard)
  @Get()
  @ApiOperation({
    summary: 'История платежей',
  })
  @ApiOkResponse({
    description: 'История платежей успешно получена',
    type: [Payment],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  userPayments(@Req() req): Promise<Payment[]> {
    const user = req.user;
    return this.paymentsService.findUsersAll(user);
  }

  @CheckAbility({ action: Action.Create, subject: CreatePaymentDto })
  @UseGuards(AbilityGuard)
  @Post()
  @ApiOperation({
    summary: 'Добавить данные финансовой операции',
  })
  @ApiBody({ type: OmitType(CreatePaymentDto, ['profile']) })
  @ApiCreatedResponse({
    description: 'Операция успешно добавлена',
    type: Payment,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  create(
    @AuthUser() profile: Profile,
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    try {
      const data = this.paymentsService.create({
        ...createPaymentDto,
        profile,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  @CheckAbility({ action: Action.Delete, subject: CreatePaymentDto })
  @UseGuards(AbilityGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить финансовую операцию',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор фин.операции',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiOkResponse({
    description: 'Операция успешно удалена',
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  delete(@Param('id') id: string) {
    return this.paymentsService.delete(id);
  }

  @CheckAbility({ action: Action.Update, subject: CreatePaymentDto })
  @UseGuards(AbilityGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить данные финансовой операции',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор фин.операции',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiBody({ type: OmitType(CreatePaymentDto, ['profile']) })
  @ApiOkResponse({
    description: 'Операция успешно обновлена',
    type: Payment,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  update(
    @AuthUser() profile: Profile,
    @Param('id') id: string,
    @Body() updatePaymentDto: Omit<CreatePaymentDto, 'profie'>,
  ): Promise<Payment> {
    return this.paymentsService.update(id, { ...updatePaymentDto, profile });
  }
}
