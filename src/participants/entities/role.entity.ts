import { Column, Entity, PrimaryColumn } from 'typeorm';

// Constants for owner and participant roles
export const ROLE_OWNER = 1;
export const ROLE_PARTICIPANT = 2;

@Entity('roles')
export class Role {
  @PrimaryColumn()
  id!: number;

  @Column({ unique: true, length: 30 })
  name!: string;
}
