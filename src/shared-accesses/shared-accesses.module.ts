import { Module, forwardRef } from '@nestjs/common';
import { SharedAccessesService } from './shared-accesses.service';
import { SharedAccessesGateway } from './gateway/shared-accesses.gateway';
import { SharedAceessesRepository } from './shared-accesses.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedAccess, SharedAccessSchema } from './schema/sharedAccess.schema';
import { BlacklistTokensModule } from 'src/blacklistTokens/blacklistTokens.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SharedAccess.name, schema: SharedAccessSchema },
    ]),
    BlacklistTokensModule,
    forwardRef(() => ProfilesModule),
    JwtModule,
  ],
  providers: [
    SharedAccessesGateway,
    SharedAccessesService,
    SharedAceessesRepository,
  ],
  exports: [SharedAccessesService],
})
export class SharedAccessesModule {}
