import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { University } from '../../universities/entity/UniversityEntity';
import { StudentProfile } from '../../student_profiles/entity/StudentProfile';
// import { StudentRefreshToken } from './student-refresh-token.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  student: Student;

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
