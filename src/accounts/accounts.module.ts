//src/account/account.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Account, AccountSchema } from './schema/account.schema';
import { HashModule } from 'src/hash/hash.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { AccountsRepository } from './accounts.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    HashModule,
    forwardRef(() => ProfilesModule),
  ],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository],
  exports: [AccountsService],
})
export class AccountsModule {}
