import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfilesModule } from 'src/profiles/profiles.module';

import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';
import { Tariff, TariffSchema } from './schema/tariff.schema';

@Module({
  imports: [
    ProfilesModule,
    MongooseModule.forFeature([{ name: Tariff.name, schema: TariffSchema }]),
  ],
  controllers: [TariffsController],
  providers: [TariffsService],
  exports: [TariffsService],
})
export class TariffsModule {}
