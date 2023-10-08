import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Profile, ProfileSchema } from 'src/profiles/schema/profile.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';

import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from './schema/payment.schema';

@Module({
  imports: [
    ProfilesModule,
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
