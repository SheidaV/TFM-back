import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../votes/entities/vote.entity.js';
import { Proposal } from './entities/proposal.entity.js';

@Injectable()
export class ProposalsRepository {
  constructor(
    @InjectRepository(Proposal)
    private readonly repository: Repository<Proposal>,
    @InjectRepository(Vote)
    private readonly votes: Repository<Vote>,
  ) {}

  findById(id: string): Promise<Proposal | null> {
    return this.repository.findOne({ where: { id } });
  }

  votesByTrip(tripId: string): Promise<Vote[]> {
    return this.votes.find({ where: { trip_id: tripId } });
  }

  findByTrip(tripId: string): Promise<Proposal[]> {
    return this.repository.find({
      where: { trip_id: tripId },
      relations: { creator: true },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(tripId: string, id: string): Promise<Proposal | null> {
    return this.repository.findOne({
      where: { id, trip_id: tripId },
      relations: { creator: true },
    });
  }

  async create(data: Partial<Proposal>): Promise<Proposal> {
    const proposal = await this.repository.save(this.repository.create(data));
    return (await this.findOne(proposal.trip_id, proposal.id))!;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
