import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { Profile, ProfileSchema } from 'src/profiles/schema/profile.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { PaymentsRepository, RepositoryPort } from './payments.repository';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [
    ProfilesModule,
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
    AbilityModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentsRepository,
    {
      provide: RepositoryPort,
      useClass: PaymentsRepository,
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
