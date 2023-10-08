import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { Profile } from 'src/profiles/schema/profile.schema';

import TypeOperation from '../types/type-operation';

export class CreatePaymentDto {
  @ApiProperty({ example: '2023-01-03' })
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  successful: boolean;

  @ApiProperty({ enum: TypeOperation, example: 'Поступление' })
  @IsEnum(TypeOperation)
  @IsNotEmpty()
  operation: TypeOperation;

  @IsNotEmpty()
  @IsObject()
  profile: Profile;

  @ApiProperty({ example: 'Пополнение счета' })
  @IsString()
  note: string;
}
