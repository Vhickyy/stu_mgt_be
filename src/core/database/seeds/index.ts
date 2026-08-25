import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../../../app.module';
import { seedUniversities } from './university_seed';
import { University } from 'src/features/student/universities/entity/UniversityEntity';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource);

    const universityRepository = dataSource.getRepository(University);

    await seedUniversities(universityRepository);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

run();
