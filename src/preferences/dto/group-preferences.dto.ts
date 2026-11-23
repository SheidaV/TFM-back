import { ApiProperty } from '@nestjs/swagger';
import { PreferenceDto } from './preference.dto.js';

export class GroupPreferencesDto {
  @ApiProperty({ nullable: true, type: PreferenceDto })
  mine!: PreferenceDto | null;

  @ApiProperty()
  responses!: number;

  @ApiProperty()
  participants!: number;

  @ApiProperty({ example: { vegetarian: 2, gluten_free: 1 } })
  food!: Record<string, number>;

  @ApiProperty({ example: { culture: 3, nature: 1 } })
  activities!: Record<string, number>;
}
