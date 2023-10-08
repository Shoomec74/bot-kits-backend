import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { Profile, ProfileSchema } from 'src/profiles/schema/profile.schema';
import { Account, AccountSchema } from 'src/accounts/schema/account.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { AccountModule } from 'src/accounts/accounts.module';
import { HashModule } from 'src/hash/hash.module';
import { jwtOptions } from 'src/configs/jwt.config';
import { BlacklistTokensModule } from 'src/blacklistTokens/blacklistTokens.module';

import { AuthController } from './auth.controller';
import { STRTAGIES } from './strategies';
import { GUARDS } from './guards';
import { AuthDtoPipe } from './pipe/auth-dto.pipe';
import { AuthService } from './auth.service';

@Module({
  imports: [
    HttpModule,
    ProfilesModule,
    AccountModule,
    HashModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync(jwtOptions()),
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
    BlacklistTokensModule,
  ],
  providers: [AuthService, ...STRTAGIES, ...GUARDS, AuthDtoPipe],
  exports: [AuthService, AuthDtoPipe],
  controllers: [AuthController],
})
export class AuthModule {}
