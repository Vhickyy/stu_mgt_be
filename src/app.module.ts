import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './core/config/database.config';
import { AuthModule as StudentAuthModule } from './features/student/auth/auth.module';
import { StudentsModule } from './features/student/students/students.module';
import { VerificationModule } from './features/shared/verification/verification.module';
import { ConfigModule } from '@nestjs/config';
import { StudentProfilesModule } from './features/student/student_profiles/student_profiles.module';
import { PermissionModule } from './features/admin/permission/permission.module';
import { RoleModule } from './features/admin/role/role.module';
import { AuthModule as AdminAuthModule } from './features/admin/auth/auth.module';
import { AdminModule } from './features/admin/admin/admin.module';
import { AdminProfileModule } from './features/admin/admin_profile/admin_profile.module';
import { UniversitiesModule } from './features/shared/universities/universities.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(databaseConfig),
    StudentAuthModule,
    StudentsModule,
    VerificationModule,
    UniversitiesModule,
    StudentProfilesModule,
    PermissionModule,
    RoleModule,
    AdminAuthModule,
    AdminModule,
    AdminProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
