import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { ItineraryDay } from './itinerary-day.entity.js';

@Entity('itinerary_items')
export class ItineraryItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  day_id!: string;

  @ManyToOne(() => ItineraryDay, (day) => day.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'day_id' })
  day!: Relation<ItineraryDay>;

  @Column({ type: 'uuid', unique: true })
  proposal_id!: string;

  @Column('int')
  position!: number;

  // postgres returns HH:MM:SS, we only use HH:MM
  @Column({
    type: 'time',
    transformer: {
      to: (value: string) => value,
      from: (value: string) => value?.slice(0, 5),
    },
  })
  start_time!: string;

  @Column({
    type: 'time',
    transformer: {
      to: (value: string) => value,
      from: (value: string) => value?.slice(0, 5),
    },
  })
  end_time!: string;
}
