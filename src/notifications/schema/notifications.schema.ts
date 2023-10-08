import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

export type NotificationDocument = HydratedDocument<Notification>;

export class FromWhom {
  @ApiProperty({ description: 'id отправителя', nullable: false })
  profileId: mongoose.Schema.Types.ObjectId;
  type: string;
}

export class ToWhom {
  @ApiProperty({ description: 'id получателя', nullable: false })
  fromId: mongoose.Schema.Types.ObjectId;
  type: string;
}

@Schema(baseSchemaOptions)
export class Notification {
  @ApiProperty({ description: 'id отправителя', nullable: false })
  @Prop({ type: FromWhom })
  fromWhom: FromWhom;

  @ApiProperty({ description: 'id получателя', nullable: false })
  @Prop({ type: ToWhom })
  toWhom: ToWhom;

  @ApiProperty({ description: 'содержание', nullable: false })
  @Prop({ type: Object })
  message: object;

  @ApiProperty({ description: 'Статус получения', nullable: false })
  @Prop()
  isReceived: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
