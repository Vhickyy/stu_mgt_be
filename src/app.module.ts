import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './core/config/database.config';
import { AuthModule } from './features/student/auth/auth.module';
import { StudentsModule } from './features/student/students/students.module';
import { VerificationService } from './features/shared/verification/verification.service';
import { VerificationModule } from './features/shared/verification/verification.module';
import { ConfigModule } from '@nestjs/config';
import { UniversitiesModule } from './features/student/universities/universities.module';
import { StudentProfilesModule } from './features/student/student_profiles/student_profiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(databaseConfig),
    AuthModule,
    StudentsModule,
    VerificationModule,
    UniversitiesModule,
    StudentProfilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
