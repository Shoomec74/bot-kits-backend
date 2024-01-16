import { Module } from '@nestjs/common';
import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tariff, TariffSchema } from './schema/tariff.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { TariffsRepository } from './tariffs.repository';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [
    ProfilesModule,
    MongooseModule.forFeature([{ name: Tariff.name, schema: TariffSchema }]),
    AbilityModule,
  ],
  controllers: [TariffsController],
  providers: [TariffsService, TariffsRepository],
  exports: [TariffsService],
})
export class TariffsModule {}
