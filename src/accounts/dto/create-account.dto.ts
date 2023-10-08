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
import { Types } from 'mongoose';

import TypeAccount from '../types/type-account';
import Role from '../types/role';

class Credentials {
  @IsEmail(
    {},
    { message: 'Email должен быть действительным адресом электронной почты' },
  )
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password не может быть пустым' })
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
