import 'reflect-metadata';
import { Admin } from 'src/features/admin/admin/admin.entity';
import { AdminProfile } from 'src/features/admin/admin_profile/entity/admin-profile.entity.dto';
import { Permission } from 'src/features/admin/permission/permission.entity';
import { Role } from 'src/features/admin/role/role.entity';

import { University } from 'src/features/shared/universities/entity/UniversityEntity';
import { StudentProfile } from 'src/features/student/student_profiles/entity/StudentProfile';
import { Student } from 'src/features/student/students/entity/Student';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  entities: [
    Admin,
    AdminProfile,
    Permission,
    Role,
    Student,
    StudentProfile,
    University,
  ],

  synchronize: process.env.NODE_ENV === 'environment',
});
