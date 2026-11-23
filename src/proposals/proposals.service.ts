import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ROLE_OWNER } from '../participants/entities/role.entity.js';
import { TripParticipant } from '../participants/entities/trip-participant.entity.js';
import { ParticipantsService } from '../participants/participants.service.js';
import { PreferencesService } from '../preferences/preferences.service.js';
import { Vote } from '../votes/entities/vote.entity.js';
import { CreateProposalDto } from './dto/create-proposal.dto.js';
import {
  IncompatibleDietDto,
  ProposalDto,
  ProposalStatus,
  ProposalVotes,
} from './dto/proposal.dto.js';
import { Proposal } from './entities/proposal.entity.js';
import { ProposalMapper } from './proposal.mapper.js';
import { ProposalsRepository } from './proposals.repository.js';

// data shared by all the proposals of a trip
interface TripContext {
  membership: TripParticipant;
  foodCounts: Record<string, number>;
  participants: number;
  votes: Vote[];
}

// accepted with more than half of the group in favour,
// rejected when that majority can no longer be reached
export function proposalStatus(
  votesFor: number,
  votesAgainst: number,
  participants: number,
): ProposalStatus {
  if (votesFor > participants / 2) {
    return 'accepted';
  }
  if (votesAgainst >= participants / 2) {
    return 'rejected';
  }
  return 'pending';
}

@Injectable()
export class ProposalsService {
  constructor(
    private readonly proposalsRepository: ProposalsRepository,
    private readonly participantsService: ParticipantsService,
    private readonly preferencesService: PreferencesService,
  ) {}

  async findAll(tripId: string, userId: string): Promise<ProposalDto[]> {
    const context = await this.context(tripId, userId);
    const proposals = await this.proposalsRepository.findByTrip(tripId);
    return proposals.map((p) => this.toDto(p, context));
  }

  async findOne(
    tripId: string,
    id: string,
    userId: string,
  ): Promise<ProposalDto> {
    const context = await this.context(tripId, userId);
    const proposal = await this.proposalsRepository.findOne(tripId, id);
    if (!proposal) {
      throw new NotFoundException('Propuesta no encontrada');
    }
    return this.toDto(proposal, context);
  }

  async getTripId(id: string): Promise<string> {
    const proposal = await this.proposalsRepository.findById(id);
    if (!proposal) {
      throw new NotFoundException('Propuesta no encontrada');
    }
    return proposal.trip_id;
  }

  async create(
    tripId: string,
    dto: CreateProposalDto,
    userId: string,
  ): Promise<ProposalDto> {
    const context = await this.context(tripId, userId);
    const proposal = await this.proposalsRepository.create(
      ProposalMapper.toEntity(dto, tripId, userId),
    );
    return this.toDto(proposal, context);
  }

  async remove(tripId: string, id: string, userId: string): Promise<void> {
    const membership = await this.participantsService.getMembership(
      tripId,
      userId,
    );
    const proposal = await this.proposalsRepository.findOne(tripId, id);
    if (!proposal) {
      throw new NotFoundException('Propuesta no encontrada');
    }
    if (!this.canDelete(proposal, membership)) {
      throw new ForbiddenException(
        'Solo quien creó la propuesta o el organizador pueden eliminarla',
      );
    }
    await this.proposalsRepository.delete(id);
  }

  incompatibleDiets(
    proposal: Pick<Proposal, 'type' | 'diet_tags'>,
    foodCounts: Record<string, number>,
  ): IncompatibleDietDto[] {
    if (proposal.type !== 'restaurant') {
      return [];
    }
    const offers = (tag: string) =>
      proposal.diet_tags.includes(tag) ||
      (tag === 'vegetarian' && proposal.diet_tags.includes('vegan'));

    return Object.entries(foodCounts)
      .filter(([tag, people]) => people > 0 && !offers(tag))
      .map(([tag, people]) => ({ tag, people }));
  }

  private async context(tripId: string, userId: string): Promise<TripContext> {
    const membership = await this.participantsService.getMembership(
      tripId,
      userId,
    );
    const [foodCounts, participants, votes] = await Promise.all([
      this.preferencesService.foodCounts(tripId),
      this.participantsService.count(tripId),
      this.proposalsRepository.votesByTrip(tripId),
    ]);
    return { membership, foodCounts, participants, votes };
  }

  private votesOf(proposal: Proposal, context: TripContext): ProposalVotes {
    const votes = context.votes.filter((v) => v.proposal_id === proposal.id);
    const votesFor = votes.filter((v) => v.value === 1).length;
    const votesAgainst = votes.filter((v) => v.value === -1).length;
    const mine = votes.find((v) => v.user_id === context.membership.user_id);

    return {
      votes_for: votesFor,
      votes_against: votesAgainst,
      my_vote: mine?.value ?? null,
      status: proposalStatus(votesFor, votesAgainst, context.participants),
    };
  }

  private canDelete(proposal: Proposal, membership: TripParticipant): boolean {
    return (
      proposal.created_by === membership.user_id ||
      membership.role.id === ROLE_OWNER
    );
  }

  private toDto(proposal: Proposal, context: TripContext): ProposalDto {
    return ProposalMapper.toDto(
      proposal,
      this.canDelete(proposal, context.membership),
      this.incompatibleDiets(proposal, context.foodCounts),
      this.votesOf(proposal, context),
    );
  }
}
