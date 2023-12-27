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
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { Profile } from 'src/profiles/schema/profile.schema';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({
    summary: 'История платежей',
  })
  @ApiOkResponse({
    description: 'История платежей успешно получена',
    type: [Payment],
  })
  @ApiForbiddenResponse({ description: 'Отказ в доступе' })
  @Get()
  userPaymentsHistory(@Req() req): Promise<Payment[]> {
    const user = req.user;
    return this.paymentsService.findUsersAll(user);
  }

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
  @Post()
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
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.paymentsService.delete(id);
  }

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
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @AuthUser() profile: Profile,
    @Param('id') id: string,
    @Body() updatePaymentDto: Omit<CreatePaymentDto, 'profie'>,
  ): Promise<Payment> {
    return this.paymentsService.update(id, { ...updatePaymentDto, profile });
  }
}
