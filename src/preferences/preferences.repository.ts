import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preference } from './entities/preference.entity.js';

@Injectable()
export class PreferencesRepository {
  constructor(
    @InjectRepository(Preference)
    private readonly repository: Repository<Preference>,
  ) {}

  findByTrip(tripId: string): Promise<Preference[]> {
    return this.repository.find({ where: { trip_id: tripId } });
  }

  async save(
    tripId: string,
    userId: string,
    data: Pick<Preference, 'food' | 'activities'>,
  ): Promise<Preference> {
    await this.repository.upsert(
      { trip_id: tripId, user_id: userId, ...data },
      ['trip_id', 'user_id'],
    );
    return (await this.repository.findOne({
      where: { trip_id: tripId, user_id: userId },
    }))!;
  }
}
