import { CreateProposalDto } from './dto/create-proposal.dto.js';
import {
  IncompatibleDietDto,
  ProposalDto,
  ProposalVotes,
} from './dto/proposal.dto.js';
import { Proposal, ProposalType } from './entities/proposal.entity.js';

export class ProposalMapper {
  static toDto(
    proposal: Proposal,
    canDelete: boolean,
    incompatibleDiets: IncompatibleDietDto[],
    votes: ProposalVotes,
  ): ProposalDto {
    return {
      id: proposal.id,
      type: proposal.type,
      title: proposal.title,
      description: proposal.description,
      cost: proposal.cost,
      location: proposal.location,
      location_lat: proposal.location_lat,
      location_lon: proposal.location_lon,
      diet_tags: proposal.diet_tags,
      created_by: {
        id: proposal.creator.id,
        name: proposal.creator.name,
        surname: proposal.creator.surname,
        alias: proposal.creator.alias,
      },
      created_at: proposal.createdAt,
      can_delete: canDelete,
      incompatible_diets: incompatibleDiets,
      ...votes,
    };
  }

  static toEntity(
    dto: CreateProposalDto,
    tripId: string,
    userId: string,
  ): Partial<Proposal> {
    const type = dto.type as ProposalType;
    return {
      trip_id: tripId,
      created_by: userId,
      type,
      title: dto.title.trim(),
      description: dto.description?.trim() || null,
      cost: dto.cost ?? null,
      location: dto.location?.trim() || null,
      location_lat: dto.location_lat ?? null,
      location_lon: dto.location_lon ?? null,
      // diet tags for restaurants
      diet_tags: type === 'restaurant' ? (dto.diet_tags ?? []) : [],
    };
  }
}
