import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AdminCombinedDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  password?: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}
