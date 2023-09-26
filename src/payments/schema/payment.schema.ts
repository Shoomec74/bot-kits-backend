import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from 'src/profiles/schema/profile.schema';
import TypeOperation from '../types/type-operation';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @ApiProperty({ example: new Date('2023-01-01') })
  @Prop({ required: true })
  date: Date;

  @ApiProperty({ example: 1000 })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ example: true })
  @Prop({ required: true })
  successful: boolean;

  @ApiProperty({ enum: TypeOperation, example: 'Поступление' })
  @Prop({ required: true, enum: TypeOperation, type: String })
  operation: TypeOperation;

  @ApiProperty({ example: 'Пополнение счета', default: '-' })
  @Prop({ default: '-' })
  note: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  })
  profile: Profile;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
