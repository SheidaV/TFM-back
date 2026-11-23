import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

export const PROPOSAL_TYPES = ['activity', 'restaurant'] as const;
export type ProposalType = (typeof PROPOSAL_TYPES)[number];

@Entity('proposals')
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  trip_id!: string;

  @Column('uuid')
  created_by!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by' })
  creator!: User;

  @Column({ length: 20 })
  type!: ProposalType;

  @Column({ length: 120 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

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
  cost!: number | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  location!: string | null;

  @Column({ type: 'double precision', nullable: true })
  location_lat!: number | null;

  @Column({ type: 'double precision', nullable: true })
  location_lon!: number | null;

  @Column('text', { array: true, default: () => "'{}'" })
  diet_tags!: string[];

  @CreateDateColumn()
  createdAt!: Date;
}
