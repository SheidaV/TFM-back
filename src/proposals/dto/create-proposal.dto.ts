import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { FOOD_OPTIONS } from '../../preferences/preference-options.js';
import { PROPOSAL_TYPES } from '../entities/proposal.entity.js';

export class CreateProposalDto {
  @ApiProperty({ enum: PROPOSAL_TYPES, example: 'restaurant' })
  @IsIn(PROPOSAL_TYPES)
  type!: string;

  @ApiProperty({ example: 'Cena en Bodegas Castañeda' })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional({ example: 'Tapas tradicionales en el centro' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string | null;

  @ApiPropertyOptional({
    example: 20,
    description: 'Coste por persona en euros',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number | null;

  @ApiPropertyOptional({ example: 'Bodegas Castañeda, Granada, Spain' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string | null;

  @ApiPropertyOptional({ example: 37.176 })
  @IsOptional()
  @IsLatitude()
  location_lat?: number | null;

  @ApiPropertyOptional({ example: -3.598 })
  @IsOptional()
  @IsLongitude()
  location_lon?: number | null;

  @ApiPropertyOptional({
    enum: FOOD_OPTIONS,
    isArray: true,
    example: ['vegetarian'],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(FOOD_OPTIONS, { each: true })
  diet_tags?: string[];
}
