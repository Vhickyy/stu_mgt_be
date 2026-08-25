import { Controller, Get, Query } from '@nestjs/common';
import { UniversitiesService } from './universities.service';

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universityService: UniversitiesService) {}

  @Get()
  async getUniversities(@Query('search') search: string) {
    return this.universityService.getUniversities(search);
  }
}
