import { ApiProperty } from '@nestjs/swagger';

export class PreferenceDto {
  @ApiProperty({ type: [String] })
  food!: string[];

  @ApiProperty({ type: [String] })
  activities!: string[];

  @ApiProperty()
  updated_at!: Date;
}
