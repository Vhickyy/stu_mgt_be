import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VerificationModule } from 'src/features/shared/verification/verification.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import adminJwtConfig from 'src/core/config/admin.jwt.config';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'admin-jwt' }),
    JwtModule.registerAsync(adminJwtConfig),
    VerificationModule,
    AdminModule,
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
