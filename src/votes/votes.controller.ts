import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProposalDto } from '../proposals/dto/proposal.dto.js';
import { UserDto } from '../users/dto/user.dto.js';
import { VoteDto } from './dto/vote.dto.js';
import { VotesService } from './votes.service.js';

@ApiTags('Votes')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token ausente o inválido' })
@ApiNotFoundResponse({
  description: 'La propuesta no existe o no participo en su viaje',
})
@UseGuards(AuthGuard('jwt'))
@Controller('proposals/:proposalId/votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Put()
  @ApiOperation({ summary: 'Emitir o cambiar mi voto' })
  @ApiOkResponse({
    type: ProposalDto,
    description: 'Propuesta con los resultados actualizados',
  })
  @ApiBadRequestResponse({ description: 'El valor debe ser 1 o -1' })
  vote(
    @Param('proposalId', ParseUUIDPipe) proposalId: string,
    @Body() dto: VoteDto,
    @Req() req: { user: UserDto },
  ): Promise<ProposalDto> {
    return this.votesService.vote(proposalId, dto.value, req.user.id);
  }

  @Delete()
  @ApiOperation({ summary: 'Retirar mi voto' })
  @ApiOkResponse({ type: ProposalDto })
  remove(
    @Param('proposalId', ParseUUIDPipe) proposalId: string,
    @Req() req: { user: UserDto },
  ): Promise<ProposalDto> {
    return this.votesService.remove(proposalId, req.user.id);
  }
}
