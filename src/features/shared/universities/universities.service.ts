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
    const universities = await this.universityRepo.find({
      where: search
        ? {
            name: ILike(`%${search}%`),
          }
        : undefined,
      take: 20,
    });

    return universities;
  }

  async getUniversitiesAdmin(search?: string) {
    const page = 1;
    const limit = 20;
    const universitiesQuery = this.universityRepo
      .createQueryBuilder('university')
      .leftJoin('university.profiles', 'profile')
      .leftJoin('profile.student', 'student')
      .select([
        'university.id',
        'university.name',
        'university.country',
        'university.stateProvince',
        'university.domains',
        'university.webPages',
      ])
      .addSelect('COUNT(student.id)', 'studentCount')
      .addSelect(
        `COUNT(student.id) FILTER (WHERE student.isVerifiedEmail = true)`,
        'activeStudentCount',
      )
      .addSelect(
        `COUNT(student.id) FILTER (WHERE student.isVerifiedEmail = false)`,
        'inactiveStudentCount',
      )
      .groupBy('university.id');

    if (search) {
      universitiesQuery.andWhere('university.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const universities = await universitiesQuery
      // .skip((page - 1) * limit)
      .limit(20)
      .getRawMany();

    const statsQuery = this.universityRepo
      .createQueryBuilder('university')
      .leftJoin('university.profiles', 'profile')
      .leftJoin('profile.student', 'student')
      .select('COUNT(DISTINCT university.id)', 'totalSchools')
      .addSelect('COUNT(student.id)', 'totalStudents')
      .addSelect(
        `COUNT(student.id) FILTER (WHERE student.isVerifiedEmail = true)`,
        'activeStudents',
      )
      .addSelect(
        `COUNT(student.id) FILTER (WHERE student.isVerifiedEmail = false)`,
        'inactiveStudents',
      );

    // if (search) {
    //   statsQuery.andWhere('university.name ILIKE :search', {
    //     search: `%${search}%`,
    //   });
    // }

    const stats = await statsQuery.getRawOne();

    return {
      universities: universities.map((university) => ({
        ...university,
        studentCount: Number(university.studentCount),
        activeStudentCount: Number(university.activeStudentCount),
        inactiveStudentCount: Number(university.inactiveStudentCount),
      })),

      stats: {
        totalSchools: Number(stats.totalSchools),
        totalStudents: Number(stats.totalStudents),
        activeStudents: Number(stats.activeStudents),
        inactiveStudents: Number(stats.inactiveStudents),
      },
    };
  }
}
