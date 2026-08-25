import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { University } from './entity/UniversityEntity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectRepository(University)
    private readonly universityRepo: Repository<University>,
  ) {}

  async getUniversities(search: string) {
    const university = await this.universityRepo.find({
      where: search
        ? {
            name: ILike(`%${search}%`),
          }
        : undefined,
      take: 20,
      order: {
        name: 'ASC',
      },
    });
    return university;
  }
}
