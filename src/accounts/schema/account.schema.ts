import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Profile } from 'src/profiles/schema/profile.schema';
import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

import TypeAccount from '../types/type-account';
import Role from '../types/role';

export type AccountDocument = HydratedDocument<Account>;

class Credentials {
  @IsEmail(
    {},
    { message: 'Email должен быть действительным адресом электронной почты' },
  )
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password не может быть пустым' })
  password: string;

  @IsString()
  @IsOptional()
  accessToken: string;

  @IsOptional()
  @IsString()
  refreshToken: string;
}

@Schema(baseSchemaOptions)
export class Account extends Document {
  @IsEnum(TypeAccount)
  @Prop({
    required: true,
    enum: TypeAccount,
    type: String,
    default: TypeAccount.LOCAL,
  })
  type: TypeAccount;

  @IsNotEmpty()
  @Prop({ required: true, enum: Role, type: String })
  role: Role;

  @ValidateNested()
  @Prop({ type: Credentials })
  credentials: Credentials;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  profile: Profile;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
