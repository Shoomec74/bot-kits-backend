import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

import { Profile } from 'src/profiles/schema/profile.schema';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  tariffId: string;

  @IsNotEmpty()
  @IsString()
  cardMask: string;

  @IsNotEmpty()
  @Type(() => Date)
  debitDate: Date;

  @IsNotEmpty()
  @IsObject()
  profile: Profile;
}
