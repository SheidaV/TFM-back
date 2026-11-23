import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID, Matches } from 'class-validator';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateItineraryItemDto {
  @ApiProperty()
  @IsUUID()
  proposal_id!: string;

  @ApiProperty({ example: '2027-05-14' })
  @IsDateString({ strict: true })
  date!: string;

  @ApiProperty({ example: '10:00' })
  @Matches(TIME, { message: 'start_time debe tener el formato HH:MM' })
  start_time!: string;

  @ApiProperty({ example: '12:30' })
  @Matches(TIME, { message: 'end_time debe tener el formato HH:MM' })
  end_time!: string;
}
