import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItineraryDay } from './entities/itinerary-day.entity.js';
import { ItineraryItem } from './entities/itinerary-item.entity.js';

@Injectable()
export class ItineraryRepository {
  constructor(
    @InjectRepository(ItineraryDay)
    private readonly days: Repository<ItineraryDay>,
    @InjectRepository(ItineraryItem)
    private readonly items: Repository<ItineraryItem>,
  ) {}

  findDays(tripId: string): Promise<ItineraryDay[]> {
    return this.days.find({
      where: { trip_id: tripId },
      relations: { items: true },
      order: { date: 'ASC' },
    });
  }

  async findOrCreateDay(tripId: string, date: string): Promise<ItineraryDay> {
    const day = await this.days.findOne({ where: { trip_id: tripId, date } });
    return day ?? this.days.save(this.days.create({ trip_id: tripId, date }));
  }

  saveItem(item: Partial<ItineraryItem>): Promise<ItineraryItem> {
    return this.items.save(this.items.create(item));
  }

  async deleteItem(id: string): Promise<void> {
    await this.items.delete(id);
  }

  // order inside the day follows the start time
  async reorder(dayId: string): Promise<void> {
    const items = await this.items.find({
      where: { day_id: dayId },
      order: { start_time: 'ASC' },
    });
    for (const [position, item] of items.entries()) {
      if (item.position !== position) {
        await this.items.update(item.id, { position });
      }
    }
  }
}
