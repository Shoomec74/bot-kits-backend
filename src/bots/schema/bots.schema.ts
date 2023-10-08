import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { IsString } from 'class-validator';

import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

import { Profile } from '../../profiles/schema/profile.schema';

export type BotDocument = HydratedDocument<Bot>;

export class Messenger {
  @ApiProperty({ example: 'VK' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'vk.com/club1245321223' })
  @IsString()
  page?: [string];

  @ApiProperty({ example: '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo' })
  @IsString()
  accessKey?: string;

  @ApiProperty({ example: 'some_url' })
  @IsString()
  url?: string;
}

@Schema(baseSchemaOptions)
export class Bot extends Document {
  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  @Prop()
  icon: string;

  @ApiProperty({
    example: 'Бот Автоответчик',
  })
  @Prop({
    required: true,
    minlength: 2,
    maxlength: 30,
  })
  botName: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  profile: Profile;

  @ApiProperty({
    example: {
      name: 'VK',
      page: 'vk.com/club1245321223',
      accessKey: '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
      url: 'some_url',
    },
  })
  @Prop({
    required: true,
    type: Messenger,
  })
  messenger: Messenger;

  @ApiProperty()
  @Prop({ type: {} })
  botSettings: object;
}

export const BotSchema = SchemaFactory.createForClass(Bot);
