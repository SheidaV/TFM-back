import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100 })
  surname!: string;

  @Column({ unique: true, length: 50 })
  alias!: string;

  @Column({ type: 'date' })
  birth_date!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ default: false })
  is_admin!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
