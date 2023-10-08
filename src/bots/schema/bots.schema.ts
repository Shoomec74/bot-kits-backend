import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

import { Profile } from '../../profiles/schema/profile.schema';
import { TypeCommands, botCommands } from '../dto/constants/botCommands';

export type BotDocument = HydratedDocument<Bot>;

export class Messenger {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  pages?: string[];

  @IsString()
  @IsOptional()
  accessKey?: string;

  @IsString()
  @IsOptional()
  url?: string;
}

@Schema(baseSchemaOptions)
export class Bot extends Document {
  @Prop({
    required: true,
    enum: ['template', 'custom'],
  })
  type: 'template' | 'custom';

  @Prop()
  icon?: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 30,
  })
  title: string;

  @Prop({ default: 'none' })
  description?: string;

  @Prop([String])
  features: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  })
  profile?: Profile;

  @Prop([Messenger])
  messengers: Messenger[];

  @Prop({ type: Object })
  settings?: object;

  @Prop({
    type: [String],
    enum: Object.values(TypeCommands),
    default: botCommands,
  })
  commands: TypeCommands[];
}

export const BotSchema = SchemaFactory.createForClass(Bot);
