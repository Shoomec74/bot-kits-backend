import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Permission } from '../shema/botAccesses.shema';

export class UpdateBotAccessDto {
  @ApiProperty({
    description: 'уровень доступа',
  })
  @IsNotEmpty()
  permission: Permission;
}
