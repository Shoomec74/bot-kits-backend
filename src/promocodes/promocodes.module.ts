import { Module } from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { PromocodesController } from './promocodes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Promocode, PromocodeSchema } from './schema/promocode.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { PromocodesRepository } from './promocodes.repository';
import { Profile, ProfileSchema } from 'src/profiles/schema/profile.schema';
import { Payment, PaymentSchema } from 'src/payments/schema/payment.schema';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [
    ProfilesModule,
    MongooseModule.forFeature([
      { name: Promocode.name, schema: PromocodeSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
    AbilityModule,
  ],
  controllers: [PromocodesController],
  providers: [PromocodesService, PromocodesRepository],
  exports: [PromocodesService],
})
export class PromocodesModule {}
