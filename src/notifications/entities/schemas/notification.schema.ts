import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { FromWhom } from './fromWhom.schema';
import { ToWhom } from './toWhom.schema';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'fromWhom' })
  fromWhom: FromWhom;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ToWhom' })
  toWhom: ToWhom;

  @Prop({ type: Object })
  message: Object;

  @Prop()
  isReceived: boolean;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
