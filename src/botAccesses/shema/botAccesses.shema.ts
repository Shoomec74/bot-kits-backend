import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, ValidateNested } from 'class-validator';

import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

import { Bot } from '../../bots/schema/bots.schema';
import { Profile } from '../../profiles/schema/profile.schema';
import { fullPermission, LEVEL_ACCESS, TPermission } from '../types/types';

export class Permission implements TPermission {
  @ApiProperty({ example: LEVEL_ACCESS.EDITOR })
  @IsEnum(LEVEL_ACCESS)
  voronki: LEVEL_ACCESS;

  @ApiProperty({ example: LEVEL_ACCESS.EDITOR })
  @IsEnum(LEVEL_ACCESS)
  newsletters?: LEVEL_ACCESS;

  @ApiProperty({ example: LEVEL_ACCESS.EDITOR })
  @IsEnum(LEVEL_ACCESS)
  lists?: LEVEL_ACCESS;

  @ApiProperty({ example: LEVEL_ACCESS.EDITOR })
  @IsEnum(LEVEL_ACCESS)
  statistic?: LEVEL_ACCESS;

  @ApiProperty({ example: LEVEL_ACCESS.EDITOR })
  @IsEnum(LEVEL_ACCESS)
  dialogs?: LEVEL_ACCESS;

  @ApiProperty({ example: LEVEL_ACCESS.EDITOR })
  @IsEnum(LEVEL_ACCESS)
  crm?: LEVEL_ACCESS;

  @ApiProperty({ example: LEVEL_ACCESS.EDITOR })
  @IsEnum(LEVEL_ACCESS)
  mini_landing?: LEVEL_ACCESS;
}

@Schema(baseSchemaOptions)
export class BotAccess extends Document {
  @ApiProperty({ example: '64ff89e7faea577804940275' })
  _id: string;

  @ApiProperty({ example: '64ff89e7faea577804940275' })
  @Prop({
    type: Types.ObjectId,
    ref: 'Profile',
    required: true,
  })
  userId: Profile;

  @ApiProperty({ example: '64ff89e7faea577804940275' })
  @Prop({
    type: Types.ObjectId,
    ref: 'Bot',
    required: true,
  })
  botId: Bot;

  @ApiProperty({ example: fullPermission })
  @Prop({
    required: true,
    type: Permission,
  })
  @ValidateNested()
  permission: Permission;

  @ApiProperty({ example: '2023-09-12T15:29:12.117Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-09-12T15:29:12.117Z' })
  updatedAt: Date;
}

export const BotAccessSchema = SchemaFactory.createForClass(BotAccess);
