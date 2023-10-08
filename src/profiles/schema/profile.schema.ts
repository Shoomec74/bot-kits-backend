import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, HydratedDocument } from 'mongoose';

import { Account } from 'src/accounts/schema/account.schema';
import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema(baseSchemaOptions)
export class Profile extends Document {
  @ApiProperty({ example: 'Ivan Ivanov' })
  @Prop({ required: true, minlength: 2, maxlength: 30 })
  username: string;

  @ApiProperty({ example: '+79501364578' })
  @Prop({ required: true })
  phone: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  @Prop({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @ApiProperty({ example: 1400 })
  @Prop({ default: 0 })
  balance: number;

  @ApiProperty()
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  })
  accounts: Account[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
