import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BotTemplate, BotTemplateSchema } from './schema/bot-template.schema';
import { BotTemplatesController } from './bot-templates.controller';
import { BotTemplatesService } from './bot-templates.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BotTemplate.name, schema: BotTemplateSchema },
    ]),
  ],
  controllers: [BotTemplatesController],
  providers: [BotTemplatesService],
})
export class BotTemplatesModule {}
