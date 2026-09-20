import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { Repository } from 'typeorm';
import { ICreateAdmin } from './types/ICreateAdmin';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
  ) {}

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepo.findOne({
      where: { email },
    });
  }

  async createAdmin(adminData: ICreateAdmin): Promise<Admin> {
    const admin = this.adminRepo.create(adminData);
    return this.adminRepo.save(admin);
  }

  async hasAnyAdmin(): Promise<boolean> {
    const count = await this.adminRepo.count();
    return count > 0;
  }
}
