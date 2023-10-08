import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { HydratedDocument } from 'mongoose';

import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

export type PlatformDocument = HydratedDocument<Platform>;

class FormFields {
  @ApiProperty({ example: true })
  @IsBoolean()
  name: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  pages: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  accessKey: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  url: boolean;
}

@Schema(baseSchemaOptions)
export class Platform {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: FormFields })
  formFields: FormFields;
}

export const PlatformSchema = SchemaFactory.createForClass(Platform);
