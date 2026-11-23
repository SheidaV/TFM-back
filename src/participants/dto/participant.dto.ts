import { ApiProperty } from '@nestjs/swagger';

export class ParticipantDto {
  @ApiProperty()
  user_id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  surname!: string;

  @ApiProperty()
  alias!: string;

  @ApiProperty({ example: 'participant' })
  role!: string;

  @ApiProperty()
  joined_at!: Date;
}
