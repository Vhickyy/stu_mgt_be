import { Injectable } from '@nestjs/common';
import { Student } from './entity/Student';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICreateStudent } from './types/ICreateStudent';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {}

  async findByEmail(email: string): Promise<Student | null> {
    return this.studentRepo.findOne({
      where: { email },
    });
  }

  async findByIdNoError(id: string): Promise<Student | null> {
    return this.studentRepo.findOne({
      where: { id },
      relations: {
        profile: {
          university: true,
        },
      },
    });
  }

  async createStudent(studentData: ICreateStudent) {
    const student = this.studentRepo.create(studentData);
    return this.studentRepo.save(student);
  }

  async save(student: Student): Promise<Student> {
    return this.studentRepo.save(student);
  }
}
