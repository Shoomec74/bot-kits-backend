import { IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { BotTemplate } from '../schema/bot-template.schema';

export default class CreateBotTemplateDto implements Partial<BotTemplate> {
  @IsUrl()
  @IsOptional()
  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  icon?: string;

  @IsString()
  @ApiProperty({ example: 'Доставка еды' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Бот для создания заказов' })
  description?: string;

  @IsOptional()
  @ApiProperty({ example: ['Создание заказов', 'Редактирование заказов'] })
  features?: string[];

  @IsObject()
  @IsOptional()
  @ApiProperty({
    example: {
      Приветствие: 'Я бот для создания заказов',
      Инлайн_кнопка: 'Текст кнопки',
    },
  })
  settings?: object;
}
