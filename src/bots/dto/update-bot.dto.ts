import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateBotDto {
  @ApiProperty({
    example:
      'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  })
  @IsUrl()
  icon?: string;

  @ApiProperty({
    example: 'Бот Автоответчик',
  })
  @IsString()
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Бот для создания заказов' })
  description?: string;

  @IsOptional()
  @ApiProperty({ example: ['Создание заказов', 'Редактирование заказов'] })
  features?: string[];

  @ApiProperty()
  @IsObject()
  settings?: object;
}
