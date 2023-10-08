import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BotAccessesService } from './botAccesses.service';
import { BotAccessesController } from './botAccesses.controller';
import { BotAccess, BotAccessSchema } from './shema/botAccesses.shema';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BotAccess.name, schema: BotAccessSchema },
    ]),
    ProfilesModule,
  ],
  controllers: [BotAccessesController],
  providers: [BotAccessesService],
  exports: [BotAccessesService],
})
export class BotAccessesModule {}
