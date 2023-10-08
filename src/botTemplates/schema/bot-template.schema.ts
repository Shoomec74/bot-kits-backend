import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

export type BotTemplateDocument = HydratedDocument<BotTemplate>;

@Schema(baseSchemaOptions)
export class BotTemplate {
  @Prop()
  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  icon: string;

  @ApiProperty({ example: 'Доставка еды' })
  @Prop({ isRequired: true })
  title: string;

  @ApiProperty({ example: 'Бот для создания заказов' })
  @Prop({ default: 'none' })
  description: string;

  @ApiProperty({ example: ['Создание заказов', 'Редактирование заказов'] })
  @Prop([String])
  features: string[];

  @ApiProperty({
    example: {
      Приветствие: 'Я бот для создания заказов',
      Инлайн_кнопка: 'Текст кнопки',
    },
  })
  @Prop({ type: Object })
  settings: object;
}

export const BotTemplateSchema = SchemaFactory.createForClass(BotTemplate);
