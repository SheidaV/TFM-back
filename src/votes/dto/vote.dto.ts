import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class VoteDto {
  @ApiProperty({ enum: [1, -1], description: '1 = a favor, -1 = en contra' })
  @IsIn([1, -1])
  value!: number;
}
