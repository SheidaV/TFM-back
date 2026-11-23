import { ApiProperty } from '@nestjs/swagger';

export class TripDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  owner_id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  destination!: string;

  @ApiProperty({ nullable: true, type: Number })
  destination_lat!: number | null;

  @ApiProperty({ nullable: true, type: Number })
  destination_lon!: number | null;

  @ApiProperty()
  start_date!: string;

  @ApiProperty()
  end_date!: string;

  @ApiProperty({ nullable: true, type: Number })
  budget!: number | null;

  @ApiProperty({ example: 'owner', description: 'Rol del usuario en el viaje' })
  role!: string;

  @ApiProperty()
  participants_count!: number;
}
