import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule, ConfigModule],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
