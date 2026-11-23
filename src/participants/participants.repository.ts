import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLE_PARTICIPANT } from './entities/role.entity.js';
import { TripParticipant } from './entities/trip-participant.entity.js';

@Injectable()
export class ParticipantsRepository {
  constructor(
    @InjectRepository(TripParticipant)
    private readonly repository: Repository<TripParticipant>,
  ) {}

  findOne(tripId: string, userId: string): Promise<TripParticipant | null> {
    return this.repository.findOne({
      where: { trip_id: tripId, user_id: userId },
      relations: { user: true, role: true },
    });
  }

  findByTrip(tripId: string): Promise<TripParticipant[]> {
    return this.repository.find({
      where: { trip_id: tripId },
      relations: { user: true, role: true },
      order: { role: { id: 'ASC' }, createdAt: 'ASC' },
    });
  }

  async add(tripId: string, userId: string): Promise<TripParticipant> {
    await this.repository.save({
      trip_id: tripId,
      user_id: userId,
      role: { id: ROLE_PARTICIPANT },
    });
    return (await this.findOne(tripId, userId))!;
  }

  async remove(tripId: string, userId: string): Promise<void> {
    await this.repository.delete({ trip_id: tripId, user_id: userId });
  }
}
