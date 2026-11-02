import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ada' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Lovelace' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  surname!: string;

  @ApiProperty({ example: 'ada' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  alias!: string;

  @ApiProperty({ example: '1990-12-10', description: 'Formato YYYY-MM-DD' })
  @IsDateString({ strict: true })
  birth_date!: string;

  @ApiProperty({ example: 'ada@weplanet.com' })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 8, maxLength: 16 })
  @IsString()
  @Length(8, 16)
  password!: string;
}
