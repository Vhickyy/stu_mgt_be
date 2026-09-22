import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../../../app.module';
import { seedUniversities } from './university_seed';
import { seedRbac } from './rbac_seed';
import { University } from 'src/features/shared/universities/entity/UniversityEntity';
import { AppDataSource } from './data-source';

async function run() {
  // const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // const dataSource = app.get(DataSource);
    await AppDataSource.initialize();

    // const universityRepository = dataSource.getRepository(University);

    // await seedUniversities(universityRepository);

    await seedRbac(AppDataSource);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

run();
