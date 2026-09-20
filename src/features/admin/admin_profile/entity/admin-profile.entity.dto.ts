import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admin } from '../../admin/admin.entity';

@Entity('admin_profiles')
export class AdminProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @OneToOne(() => Admin, (admin) => admin.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  admin: Admin;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
