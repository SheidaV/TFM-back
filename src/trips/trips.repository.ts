import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { ROLE_OWNER } from '../participants/entities/role.entity.js';
import { TripParticipant } from '../participants/entities/trip-participant.entity.js';
import { Trip } from './entities/trip.entity.js';

@Injectable()
export class TripsRepository {
  constructor(
    @InjectRepository(Trip)
    private readonly repository: Repository<Trip>,
    @InjectRepository(TripParticipant)
    private readonly participants: Repository<TripParticipant>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  createWithOwner(data: Partial<Trip>): Promise<Trip> {
    return this.dataSource.transaction(async (manager) => {
      const trip = await manager.save(Trip, manager.create(Trip, data));
      await manager.save(TripParticipant, {
        trip_id: trip.id,
        user_id: trip.owner_id,
        role: { id: ROLE_OWNER },
      });
      return trip;
    });
  }

  findParticipation(
    tripId: string,
    userId: string,
  ): Promise<TripParticipant | null> {
    return this.participants.findOne({
      where: { trip_id: tripId, user_id: userId },
      relations: { trip: true, role: true },
    });
  }

  findParticipationsByUser(userId: string): Promise<TripParticipant[]> {
    return this.participants.find({
      where: { user_id: userId },
      relations: { trip: true, role: true },
      order: { trip: { start_date: 'ASC' } },
    });
  }

  async countParticipants(tripIds: string[]): Promise<Map<string, number>> {
    const counts = new Map<string, number>();
    if (tripIds.length === 0) {
      return counts;
    }

    const rows = await this.participants
      .createQueryBuilder('participant')
      .select('participant.trip_id', 'trip_id')
      .addSelect('COUNT(*)', 'total')
      .where({ trip_id: In(tripIds) })
      .groupBy('participant.trip_id')
      .getRawMany<{ trip_id: string; total: string }>();

    for (const row of rows) {
      counts.set(row.trip_id, Number(row.total));
    }
    return counts;
  }

  save(trip: Trip): Promise<Trip> {
    return this.repository.save(trip);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
