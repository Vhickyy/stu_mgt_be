import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  passwordHash: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isVerifiedEmail: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isActive: boolean;

  @ManyToMany(() => Role, {
    cascade: false,
  })
  @JoinTable({
    name: 'admin_roles',
    joinColumn: {
      name: 'admin_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
