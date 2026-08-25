import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyStudentEmailtDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class ResendVerifyEmailtDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
