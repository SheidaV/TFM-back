import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'ada@weplanet.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 8, maxLength: 16 })
  @IsString()
  @Length(8, 16)
  password!: string;
}