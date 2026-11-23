import { ApiProperty } from '@nestjs/swagger';

export type ProposalStatus = 'accepted' | 'rejected' | 'pending';

export interface ProposalVotes {
  votes_for: number;
  votes_against: number;
  my_vote: number | null;
  status: ProposalStatus;
}

export class ProposalCreatorDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  surname!: string;

  @ApiProperty()
  alias!: string;
}

export class IncompatibleDietDto {
  @ApiProperty({ example: 'vegan' })
  tag!: string;

  @ApiProperty({
    example: 2,
    description: 'People in the group with this diet',
  })
  people!: number;
}

export class ProposalDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'restaurant' })
  type!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ nullable: true, type: String })
  description!: string | null;

  @ApiProperty({ nullable: true, type: Number })
  cost!: number | null;

  @ApiProperty({ nullable: true, type: String })
  location!: string | null;

  @ApiProperty({ nullable: true, type: Number })
  location_lat!: number | null;

  @ApiProperty({ nullable: true, type: Number })
  location_lon!: number | null;

  @ApiProperty({ type: [String] })
  diet_tags!: string[];

  @ApiProperty({ type: ProposalCreatorDto })
  created_by!: ProposalCreatorDto;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty({ description: 'Creator or trip owner' })
  can_delete!: boolean;

  @ApiProperty({ type: [IncompatibleDietDto] })
  incompatible_diets!: IncompatibleDietDto[];

  @ApiProperty()
  votes_for!: number;

  @ApiProperty()
  votes_against!: number;

  @ApiProperty({ nullable: true, enum: [1, -1], type: Number })
  my_vote!: number | null;

  @ApiProperty({ enum: ['accepted', 'rejected', 'pending'] })
  status!: ProposalStatus;
}
