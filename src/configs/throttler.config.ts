import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ThrottlerAsyncOptions,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';

const throttlerOptions = (
  configService: ConfigService,
): ThrottlerModuleOptions => [
  {
    ttl: +configService.get('THROTTLE_TIME_WINDOW_SECONDS') * 1000,
    limit: configService.get('THROTTLE_REQUESTS_LIMIT'),
  },
];

export const throttlerConfig = (): ThrottlerAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => throttlerOptions(configService),
});
