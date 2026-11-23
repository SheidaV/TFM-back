import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class InviteParticipantDto {
  @ApiProperty({ example: 'ada', description: 'Alias or email' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  identifier!: string;
}
