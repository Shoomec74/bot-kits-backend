import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { Messenger } from '../schema/bots.schema';

export class CopyBotDto {
  @ApiProperty()
  @Type(() => Messenger)
  @ValidateNested()
  messenger: Messenger;
}
