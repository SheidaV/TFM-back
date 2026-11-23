import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity.js';

@Injectable()
export class VotesRepository {
  constructor(
    @InjectRepository(Vote)
    private readonly repository: Repository<Vote>,
  ) {}

  // one vote per person and proposal, voting again replaces it
  async save(
    proposalId: string,
    tripId: string,
    userId: string,
    value: number,
  ): Promise<void> {
    await this.repository.upsert(
      { proposal_id: proposalId, trip_id: tripId, user_id: userId, value },
      ['proposal_id', 'user_id'],
    );
  }

  async delete(proposalId: string, userId: string): Promise<void> {
    await this.repository.delete({ proposal_id: proposalId, user_id: userId });
  }
}
