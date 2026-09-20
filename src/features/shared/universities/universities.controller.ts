import { Controller, Get, Query } from '@nestjs/common';
import { UniversitiesService } from './universities.service';

@Controller()
export class UniversitiesController {
  constructor(private readonly universityService: UniversitiesService) {}

  @Get('universities')
  async getUniversities(@Query('search') search: string) {
    return this.universityService.getUniversities(search);
  }

  @Get('admin/universities')
  async getUniversitiesAdmin(@Query('search') search: string) {
    return this.universityService.getUniversitiesAdmin(search);
  }
}
