import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type toWhomDocument = HydratedDocument<ToWhom>;

@Schema()
export class ToWhom {
  @Prop()
  fromId: mongoose.Schema.Types.ObjectId;

  @Prop()
  type: string;
}

export const ToWhomSchema = SchemaFactory.createForClass(ToWhom);
