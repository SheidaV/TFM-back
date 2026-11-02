import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  surname!: string;

  @ApiProperty()
  alias!: string;

  @ApiProperty()
  birth_date!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  is_admin!: boolean;
}
