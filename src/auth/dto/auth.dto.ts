import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
//auth.dto.ts
export class AuthDto {
  @Type(() => CreateProfileDto)
  @ValidateNested()
  profileData: CreateProfileDto;

  @Type(() => CreateAccountDto)
  @ValidateNested()
  accountData: CreateAccountDto;
}
