////scr/profiles/profiles.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HashService } from 'src/hash/hash.service';
import { Account, AccountSchema } from 'src/accounts/schema/account.schema';

import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { Profile, ProfileSchema } from './schema/profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService, HashService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
