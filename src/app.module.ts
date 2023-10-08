import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthController } from './auth/auth.controller';

import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { BotAccessesModule } from './botAccesses/botAccesses.module';
import { TariffsModule } from './tariffs/tariffs.module';
import { PlatformModule } from './platforms/platforms.module';

import { PromocodesModule } from './promocodes/promocodes.module';

import { AccountModule } from './accounts/accounts.module';
import { databaseConfig } from './configs/database.config';

import { BotsModule } from './bots/bots.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { HttpModule } from '@nestjs/axios';
import { NotificationModule } from './notifications/notifications.module';
import { BlacklistTokensModule } from './blacklistTokens/blacklistTokens.module';
import { throttlerConfig } from './configs/throttler.config';

//app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env'],
    }),
    ThrottlerModule.forRootAsync(throttlerConfig()),
    MongooseModule.forRootAsync(databaseConfig()),
    ProfilesModule,
    TariffsModule,
    AccountModule,
    AuthModule,
    BotAccessesModule,
    PlatformModule,
    PromocodesModule,
    BotsModule,
    SubscriptionsModule,
    PaymentsModule,
    HttpModule,
    NotificationModule,
    BlacklistTokensModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
