import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FromWhomDocument = HydratedDocument<FromWhom>;

@Schema()
export class FromWhom {
  @Prop()
  profileId: mongoose.Schema.Types.ObjectId;

  @Prop()
  type: string;
}

export const FromWhomSchema = SchemaFactory.createForClass(FromWhom);
