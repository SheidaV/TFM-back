import { ApiProperty } from '@nestjs/swagger';

export class ItineraryProposalDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ example: 'activity' })
  type!: string;

  @ApiProperty({ nullable: true, type: String })
  location!: string | null;

  @ApiProperty({ nullable: true, type: Number })
  cost!: number | null;

  @ApiProperty({ example: 'accepted' })
  status!: string;
}

export class ItineraryItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: '10:00' })
  start_time!: string;

  @ApiProperty({ example: '12:30' })
  end_time!: string;

  @ApiProperty({ type: ItineraryProposalDto })
  proposal!: ItineraryProposalDto;
}

export class ItineraryDayDto {
  @ApiProperty({ example: '2027-05-14' })
  date!: string;

  @ApiProperty({
    description: 'Day left outside the trip after editing its dates',
  })
  outside_trip!: boolean;

  @ApiProperty({ type: [ItineraryItemDto] })
  items!: ItineraryItemDto[];
}

export class ItineraryDto {
  @ApiProperty({ description: 'Only the trip owner can edit' })
  can_edit!: boolean;

  @ApiProperty({ type: [ItineraryDayDto] })
  days!: ItineraryDayDto[];

  @ApiProperty({
    type: [ItineraryProposalDto],
    description: 'Accepted proposals not scheduled yet',
  })
  available!: ItineraryProposalDto[];
}
