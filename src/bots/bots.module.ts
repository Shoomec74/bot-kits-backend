import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Bot, BotSchema } from './schema/bots.schema';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';
import { BotAccessesModule } from '../botAccesses/botAccesses.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bot.name, schema: BotSchema }]),
    BotAccessesModule,
  ],
  controllers: [BotsController],
  providers: [BotsService],
})
export class BotsModule {}
