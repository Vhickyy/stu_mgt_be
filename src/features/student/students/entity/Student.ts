import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentProfile } from '../../student_profiles/entity/StudentProfile';
// import { StudentRefreshToken } from './student-refresh-token.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'boolean', default: false })
  isVerifiedEmail!: boolean;

  @OneToOne(() => StudentProfile, (profile) => profile.student, {
    cascade: ['insert'],
  })
  profile!: StudentProfile;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verificationId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  otpHash: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  otpLastSentAt: Date | null;

  //   @OneToMany(
  //     () => StudentRefreshToken,
  //     (refreshToken) => refreshToken.student,
  //   )
  //   refreshTokens: StudentRefreshToken[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
