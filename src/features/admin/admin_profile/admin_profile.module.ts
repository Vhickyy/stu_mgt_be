import { Module } from '@nestjs/common';
import { AdminProfileController } from './admin_profile.controller';
import { AdminProfileService } from './admin_profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminProfile } from './entity/admin-profile.entity.dto';

@Module({
  imports: [TypeOrmModule.forFeature([AdminProfile])],
  controllers: [AdminProfileController],
  providers: [AdminProfileService],
})
export class AdminProfileModule {}
