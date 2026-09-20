import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entity/Student';
import { StudentsController } from './students.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentsService],
  exports: [StudentsService],
  controllers: [StudentsController],
})
export class StudentsModule {}
