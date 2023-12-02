import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Messenger } from '../schema/bots.schema';
import { Type } from 'class-transformer';
import { TBuilderData } from '../schema/types/botBuilderTypes';

//create-bot.dto.ts
export class CreateBotDto {
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  @IsUrl()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    example: 'Бот Автоответчик',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Бот для создания заказов' })
  description?: string;

  @ApiProperty()
  @Type(() => Messenger)
  @ValidateNested()
  messengers: Messenger[];

  @IsOptional()
  @ApiProperty()
  features?: TBuilderData;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    example: {
      Приветствие: 'Я бот для создания заказов',
      Инлайн_кнопка: 'Текст кнопки',
    },
  })
  settings?: object;

  @IsOptional()
  content?: [object];

  @IsOptional()
  @IsBoolean()
  isToPublish?: boolean;
}
