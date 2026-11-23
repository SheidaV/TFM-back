import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTripDto {
  @ApiProperty({ example: 'Escapada a Granada' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Granada, España' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  destination!: string;

  @ApiPropertyOptional({ example: 37.1735 })
  @IsOptional()
  @IsLatitude()
  destination_lat?: number | null;

  @ApiPropertyOptional({ example: -3.5995 })
  @IsOptional()
  @IsLongitude()
  destination_lon?: number | null;

  @ApiProperty({ example: '2027-05-14', description: 'Format YYYY-MM-DD' })
  @IsDateString({ strict: true })
  start_date!: string;

  @ApiProperty({ example: '2027-05-17', description: 'Format YYYY-MM-DD' })
  @IsDateString({ strict: true })
  end_date!: string;

  @ApiPropertyOptional({
    example: 400,
    description: 'Presupuesto por persona',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  budget?: number | null;
}
