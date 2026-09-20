import { StudentProfile } from 'src/features/student/student_profiles/entity/StudentProfile';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('universities')
export class University {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  country!: string;

  @Column({ type: 'varchar', length: 2 })
  alphaTwoCode!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  stateProvince!: string | null;

  @Column({ type: 'text', array: true, default: '{}' })
  domains!: string[];

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 500 })
  uniqueKey!: string;

  @Column({ type: 'text', array: true, default: '{}' })
  webPages!: string[];

  @OneToMany(
    () => StudentProfile,
    (studentProfile) => studentProfile.university,
  )
  profiles: StudentProfile[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
