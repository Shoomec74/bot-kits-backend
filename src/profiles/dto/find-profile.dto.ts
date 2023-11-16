import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindProfileDto {
  @ApiProperty({ example: 'ivan@yandex.ru' })
  @IsString()
  email?: string;

  @ApiProperty({ example: 'Ivan Ivanov' })
  @IsString()
  username?: string;

  @ApiProperty({ example: '+79501364578' })
  @IsString()
  phone?: string;
}
