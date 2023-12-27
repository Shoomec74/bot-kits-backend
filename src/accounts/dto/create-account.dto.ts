import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import TypeAccount from '../types/type-account';
import Role from '../types/role';
import { Types } from 'mongoose';
import {
  EMAIL_VALIDATE_MESSAGE,
  EMAIL_EMPTY_MESSAGE,
  PASSWORD_EMPTY_MESSAGE,
} from 'src/utils/constants';

class Credentials {
  @IsEmail({}, { message: EMAIL_VALIDATE_MESSAGE })
  @IsNotEmpty({ message: EMAIL_EMPTY_MESSAGE })
  email: string;

  @IsString()
  @IsNotEmpty({ message: PASSWORD_EMPTY_MESSAGE })
  password: string;

  @IsString()
  @IsOptional()
  accessToken: string;

  @IsOptional()
  @IsString()
  refreshToken: string;
}

export class CreateAccountDto {
  @IsEnum(TypeAccount)
  type: TypeAccount;

  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @Type(() => Credentials)
  @ValidateNested()
  credentials?: Credentials;

  @ApiProperty({ example: '64f9ac26edb84d7ebf6281d0' })
  profile: Types.ObjectId | string;
}
