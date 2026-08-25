import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomInt, randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { VerificationPurpose } from './contants/VerificationConstant';

@Injectable()
export class VerificationService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateOtp() {
    const otp = randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    return { otp, otpHash };
  }

  async generateToken({
    id,
    purpose,
  }: {
    id: string;
    purpose: VerificationPurpose;
  }) {
    const verificationId = randomUUID();
    const token = this.jwtService.sign(
      { sub: { id, verificationId }, purpose },
      {
        secret: this.configService.get<string>('OTP_SECRET'),
        expiresIn: this.configService.get<string>('OTP_EXPIRY'),
      } as any,
    );
    return token;
  }

  async verifyToken({
    token,
    purpose,
  }: {
    token: string;
    purpose: VerificationPurpose;
  }) {
    let payload: { sub: { id: string }; purpose: VerificationPurpose };
    try {
      payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('OTP_SECRET'),
      });
      if (payload.purpose !== purpose)
        throw new BadRequestException('Invalid verification token');
      return { id: payload.sub.id };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid verification token');
    }
  }

  async verifyOtp({
    otp,
    otpHash,
  }: {
    otp: string;
    otpHash: string | null;
  }): Promise<boolean> {
    if (!otpHash) {
      throw new BadRequestException('No active verification code.');
    }
    const isValid = await bcrypt.compare(otp, otpHash);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }
    return true;
  }

  canResendOtp(otpLastSentAt: Date | null) {
    if (!otpLastSentAt) {
      throw new BadRequestException('No active verification code.');
    }
    const now = Date.now();
    const lastSentAt = otpLastSentAt?.getTime() ?? 0;
    const elapsed = now - lastSentAt;
    if (elapsed < 60 * 1000) {
      throw new BadRequestException({
        message: {
          title: 'Wait',
          message: 'Please wait few seconds before requesting another OTP',
        },
      });
    }
  }
}
