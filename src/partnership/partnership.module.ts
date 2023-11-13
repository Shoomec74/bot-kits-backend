import { Module, forwardRef } from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { PartnershipController } from './partnership.controller';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [forwardRef(() => ProfilesModule)],
  controllers: [PartnershipController],
  providers: [PartnershipService],
  exports: [PartnershipService],
})
export class PartnershipModule {}
