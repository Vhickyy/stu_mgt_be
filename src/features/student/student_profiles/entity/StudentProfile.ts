import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../students/entity/Student';
import { University } from 'src/features/shared/universities/entity/UniversityEntity';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  @ManyToOne(() => University, (university) => university.profiles)
  university: University;

  @Column({ type: 'smallint' })
  admissionYear: number;

  @OneToOne(() => Student, (student) => student.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  student: Student;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
