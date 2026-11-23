import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

// trip_id is not in the PEC2 model: it lets the database delete
// the votes of someone who leaves the trip
@Entity('votes')
export class Vote {
  @PrimaryColumn('uuid')
  proposal_id!: string;

  @PrimaryColumn('uuid')
  user_id!: string;

  @Column('uuid')
  trip_id!: string;

  // 1 = in favour, -1 = against
  @Column('smallint')
  value!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
