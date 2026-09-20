import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { AdminProfile } from '../admin_profile/entity/admin-profile.entity.dto';

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

  @OneToOne(() => AdminProfile, (profile) => profile.admin, {
    cascade: ['insert'],
  })
  profile!: AdminProfile;

  @ManyToOne(() => Role, (role) => role.admins, { nullable: false })
  role: Role;
  // @ManyToMany(() => Role)
  // @JoinTable({
  //   name: 'admin_roles',
  //   joinColumn: {
  //     name: 'admin_id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'role_id',
  //     referencedColumnName: 'id',
  //   },
  // })
  // roles: Role[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  verificationId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resetPasswordToken: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
