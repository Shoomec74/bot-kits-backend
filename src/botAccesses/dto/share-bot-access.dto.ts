import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { defaultPermission, TPermission } from '../types/types';

export class ShareBotAccessDto {
  @ApiProperty({
    description: 'Email зарегистрированного пользователя',
    example: 'test@test.ru',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'уровень доступа',
    example: defaultPermission,
  })
  @IsNotEmpty()
  permission: TPermission;
}
