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
  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  @Prop({ required: true })
  icon: string;

  @ApiProperty({ example: 'VK' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    example: {
      name: true,
      pages: true,
      accessKey: false,
      url: true,
    },
  })
  @Prop({ required: true, type: FormFields })
  formFields: FormFields;
}

export const PlatformSchema = SchemaFactory.createForClass(Platform);
