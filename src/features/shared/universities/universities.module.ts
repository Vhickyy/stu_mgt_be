import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './entity/UniversityEntity';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([University])],
  providers: [UniversitiesService],
  controllers: [UniversitiesController],
})
export class UniversitiesModule {}
