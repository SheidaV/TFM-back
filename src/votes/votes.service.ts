import { Injectable } from '@nestjs/common';
import { ParticipantsService } from '../participants/participants.service.js';
import { ProposalDto } from '../proposals/dto/proposal.dto.js';
import { ProposalsService } from '../proposals/proposals.service.js';
import { VotesRepository } from './votes.repository.js';

@Injectable()
export class VotesService {
  constructor(
    private readonly votesRepository: VotesRepository,
    private readonly proposalsService: ProposalsService,
    private readonly participantsService: ParticipantsService,
  ) {}

  async vote(
    proposalId: string,
    value: number,
    userId: string,
  ): Promise<ProposalDto> {
    const tripId = await this.proposalsService.getTripId(proposalId);
    await this.participantsService.getMembership(tripId, userId);
    await this.votesRepository.save(proposalId, tripId, userId, value);
    return this.proposalsService.findOne(tripId, proposalId, userId);
  }

  async remove(proposalId: string, userId: string): Promise<ProposalDto> {
    const tripId = await this.proposalsService.getTripId(proposalId);
    await this.participantsService.getMembership(tripId, userId);
    await this.votesRepository.delete(proposalId, userId);
    return this.proposalsService.findOne(tripId, proposalId, userId);
  }
}
