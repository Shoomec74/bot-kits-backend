import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Messenger } from '../schema/bots.schema';

export class CreateBotDto {
  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  @IsUrl()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({
    example: 'Бот Автоответчик',
  })
  @IsString()
  @IsNotEmpty()
  botName: string;

  @ApiProperty()
  @Type(() => Messenger)
  @ValidateNested()
  messenger: Messenger;

  @ApiProperty()
  @IsObject()
  botSettings: object;
}
