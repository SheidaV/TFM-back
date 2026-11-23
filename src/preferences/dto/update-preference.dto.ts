import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsIn } from 'class-validator';
import { ACTIVITY_OPTIONS, FOOD_OPTIONS } from '../preference-options.js';

export class UpdatePreferenceDto {
  @ApiProperty({ enum: FOOD_OPTIONS, isArray: true, example: ['vegetarian'] })
  @IsArray()
  @ArrayUnique()
  @IsIn(FOOD_OPTIONS, { each: true })
  food!: string[];

  @ApiProperty({
    enum: ACTIVITY_OPTIONS,
    isArray: true,
    example: ['culture', 'nature'],
  })
  @IsArray()
  @ArrayUnique()
  @IsIn(ACTIVITY_OPTIONS, { each: true })
  activities!: string[];
}
