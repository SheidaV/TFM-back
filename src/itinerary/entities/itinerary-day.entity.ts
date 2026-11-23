import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  Unique,
} from 'typeorm';
import { ItineraryItem } from './itinerary-item.entity.js';

@Entity('itinerary_days')
@Unique('UQ_itinerary_days_trip_date', ['trip_id', 'date'])
export class ItineraryDay {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  trip_id!: string;

  @Column({ type: 'date' })
  date!: string;

  @OneToMany(() => ItineraryItem, (item) => item.day)
  items!: Relation<ItineraryItem[]>;
}
