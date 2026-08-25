import { Module } from '@nestjs/common';
import { StudentProfilesService } from './student_profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentProfile } from './entity/StudentProfile';
import { StudentProfilesController } from './student_profiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudentProfile])],
  providers: [StudentProfilesService],
  controllers: [StudentProfilesController],
})
export class StudentProfilesModule {}
