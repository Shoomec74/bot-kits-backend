import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Post,
  Param,
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
  getSchemaPath,
} from '@nestjs/swagger';

import { Payment } from 'src/payments/schema/payment.schema';

import { SubscriptionsService } from './subscriptions.service';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
import { Subscription } from './schema/subscription.schema';

@ApiTags('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @ApiOperation({
    summary: 'Данные страницы "Подписка и платежи"',
  })
  @ApiOkResponse({
    description: 'Данные подписок и платежей успешно получены',
    schema: {
      type: 'object',
      properties: {
        tariff: { type: 'string', example: 'Бизнес' },
        status: { type: 'boolean', example: true },
        cardMask: { type: 'string', example: '4500 *** 1119' },
        debitDate: { type: 'date', example: '2023-09-12' },
        balance: { type: 'number', example: 1234 },
        payments: { type: 'array', items: { $ref: getSchemaPath(Payment) } },
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @Get()
  subscriptionAndPayments(@Req() req): Promise<object> {
    const user = req.user;
    return this.subscriptionsService.subscriptionAndPayments(user);
  }

  @ApiOperation({
    summary: 'Активировать(отменить) подписку',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Подписка активирована',
    type: Subscription,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @Post('activate')
  activateSubscription(
    @Req() req,
    @Body() body: { status: boolean },
  ): Promise<Subscription> {
    const user = req.user;
    return this.subscriptionsService.activateSubscription(user, body.status);
  }

  @ApiOperation({
    summary: 'Оформить подписку',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор тарифа',
    example: '64f81ba37571bfaac18a857f',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cardMask: { type: 'string', example: '4500 *** 1119' },
        debitDate: { type: 'date', example: '2023-09-12' },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Подписка оформлена',
    type: Subscription,
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @Post(':id')
  createSubscription(
    @Req() req,
    @Body() body: { cardMask: string; debitDate: string },
    @Param('id') id: string,
  ): Promise<Subscription> {
    const profile = req.user;
    return this.subscriptionsService.create({
      tariffId: id,
      cardMask: body.cardMask,
      debitDate: new Date(body.debitDate),
      profile,
    });
  }
}
