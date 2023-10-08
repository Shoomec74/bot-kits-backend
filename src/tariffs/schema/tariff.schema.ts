import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

@Schema(baseSchemaOptions) //Включает поля createdAt и updatedAt
export class Tariff extends Document {
  @ApiProperty({ example: 'Старт' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ example: 390 })
  @Prop({ required: true })
  price: number;
}

export const TariffSchema = SchemaFactory.createForClass(Tariff);
