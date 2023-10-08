//src/account/account.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HashModule } from 'src/hash/hash.module';
import { ProfilesModule } from 'src/profiles/profiles.module';

import { AccountService } from './accounts.service';
import { AccountController } from './accounts.controller';
import { Account, AccountSchema } from './schema/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    HashModule,
    ProfilesModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
