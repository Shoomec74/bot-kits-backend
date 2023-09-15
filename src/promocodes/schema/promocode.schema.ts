import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) //Включает поля createdAt и updatedAt
export class Promocode extends Document {
  @ApiProperty({ example: 'PROMO50' })
  @Prop({ required: true, unique: true })
  code: string;

  @ApiProperty({ example: '2023-09-10T16:07:34.285Z' })
  @Prop({ required: true, isInteger: true })
  actionPeriod: Date;

  @ApiProperty({ example: 2 })
  @Prop({ required: true, isInteger: true })
  activationCount: number;

  @ApiProperty({ example: 10 })
  @Prop({ required: true, isInteger: true })
  maxActivationCount: number;
}

export const PromocodeSchema = SchemaFactory.createForClass(Promocode);
