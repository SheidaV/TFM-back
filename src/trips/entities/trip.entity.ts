import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TripParticipant } from '../../participants/entities/trip-participant.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  owner_id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 150 })
  destination!: string;

  // Coordinates of the destination, if available, for the map
  @Column({ type: 'double precision', nullable: true })
  destination_lat!: number | null;

  @Column({ type: 'double precision', nullable: true })
  destination_lon!: number | null;

  @Column({ type: 'date' })
  start_date!: string;

  @Column({ type: 'date' })
  end_date!: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  budget!: number | null;

  @OneToMany(() => TripParticipant, (participant) => participant.trip)
  participants!: TripParticipant[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
