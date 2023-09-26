import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from 'src/profiles/schema/profile.schema';
import { Tariff } from 'src/tariffs/schema/tariff.schema';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tariff',
    required: true,
  })
  tariff: Tariff;

  @ApiProperty({ example: true, default: false })
  @Prop({ required: true, default: false })
  status: boolean;

  @ApiProperty({ example: '4500 *** 1119' })
  @Prop()
  cardMask: string;

  @ApiProperty({ example: new Date('2023-01-01') })
  @Prop({ default: new Date(), required: true })
  debitDate: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    unique: true,
    required: true,
  })
  profile: Profile;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
