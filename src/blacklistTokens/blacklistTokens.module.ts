import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlacklistTokensService } from './blacklistTokens.service';
import {
  BlacklistTokens,
  BlacklistTokensSchema,
} from './schema/blacklistTokens.schema';
import { BlacklistTokensController } from './blacklistTokens.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlacklistTokens.name, schema: BlacklistTokensSchema },
    ]),
  ],
  controllers: [BlacklistTokensController],
  providers: [BlacklistTokensService],
  exports: [BlacklistTokensService],
})
export class BlacklistTokensModule {}
