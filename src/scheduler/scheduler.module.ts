// scheduler.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionSchema,
} from 'src/subscriptions/schema/subscription.schema';
import { Payment, PaymentSchema } from 'src/payments/schema/payment.schema';
import { Tariff, TariffSchema } from 'src/tariffs/schema/tariff.schema';
import { Profile, ProfileSchema } from 'src/profiles/schema/profile.schema';
import {
  Promocode,
  PromocodeSchema,
} from 'src/promocodes/schema/promocode.schema';
import { Mailing, MailingSchema } from 'src/mailing/schema/mailing.schema';
import { MailingModule } from 'src/mailing/mailing.module';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Tariff.name, schema: TariffSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Promocode.name, schema: PromocodeSchema },
      { name: Mailing.name, schema: MailingSchema },
    ]),
    MailingModule,
    ScheduleModule.forRoot(),
    RabbitmqModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
