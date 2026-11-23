import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { Role } from './role.entity.js';

@Entity('trip_participants')
export class TripParticipant {
  @PrimaryColumn('uuid')
  trip_id!: string;

  @PrimaryColumn('uuid')
  user_id!: string;

  @ManyToOne(() => Trip, (trip) => trip.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip!: Trip;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @CreateDateColumn()
  createdAt!: Date;
}
