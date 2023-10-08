import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfilesModule } from 'src/profiles/profiles.module';

import { PromocodesService } from './promocodes.service';
import { PromocodesController } from './promocodes.controller';
import { Promocode, PromocodeSchema } from './schema/promocode.schema';

@Module({
  imports: [
    ProfilesModule,
    MongooseModule.forFeature([
      { name: Promocode.name, schema: PromocodeSchema },
    ]),
  ],
  controllers: [PromocodesController],
  providers: [PromocodesService],
  exports: [PromocodesService],
})
export class PromocodesModule {}
