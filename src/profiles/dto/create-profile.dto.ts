import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

import { Account } from 'src/accounts/schema/account.schema';
//create-profile.dto.ts

export class CreateProfileDto {
  @ApiProperty({ example: 'Ivan Ivanov' })
  @IsString()
  @IsNotEmpty({ message: 'Username не может быть пустым' })
  @Length(2, 30, {
    message: 'Длинная username должна быть от 2 до 30 символов',
  })
  username: string;

  @ApiProperty({ example: '+79501364578' })
  @IsNotEmpty({ message: 'Phone не может быть пустым' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300', required: false })
  @IsUrl({}, { message: 'Avatar должен быть действительным URL' })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 1400 })
  @IsNumber({}, { message: 'Баланс должен быть числом' })
  @IsOptional()
  balance?: number;

  @ApiProperty({ required: false })
  @IsArray()
  @ArrayNotEmpty({ message: 'Аккаунтов не может быть 0' })
  accounts: Account[];
}
