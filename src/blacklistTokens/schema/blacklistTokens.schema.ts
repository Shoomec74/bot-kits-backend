import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

export type BlacklistTokensDocument = Document & BlacklistTokens;

@Schema(baseSchemaOptions)
export class BlacklistTokens {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expirationDate: Date;
}

export const BlacklistTokensSchema =
  SchemaFactory.createForClass(BlacklistTokens);
