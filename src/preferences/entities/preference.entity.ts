import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('preferences')
@Unique('UQ_preferences_trip_user', ['trip_id', 'user_id'])
export class Preference {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user_id!: string;

  @Column('uuid')
  trip_id!: string;

  @Column('text', { array: true, default: () => "'{}'" })
  food!: string[];

  @Column('text', { array: true, default: () => "'{}'" })
  activities!: string[];

  @UpdateDateColumn()
  updatedAt!: Date;
}
