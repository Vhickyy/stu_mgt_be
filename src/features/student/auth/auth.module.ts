import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import jwtConfig from 'src/core/config/jwt.config';
import { StudentsModule } from '../students/students.module';
import { VerificationModule } from 'src/features/shared/verification/verification.module';
import { StudentJwtAuthGuard } from './gaurds/student.jwt.gaurd';
import { StudentJwtStrategy } from './strategy/student.jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'student-jwt' }),
    JwtModule.registerAsync(jwtConfig),
    StudentsModule,
    VerificationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, StudentJwtStrategy],
})
export class AuthModule {}
