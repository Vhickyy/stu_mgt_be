import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterStudentDto } from './dto/RegisterStudentDto';
import { StudentsService } from '../students/students.service';
import * as bcrypt from 'bcrypt';
import { VerificationService } from 'src/features/shared/verification/verification.service';
import { VerificationPurpose } from 'src/features/shared/verification/contants/VerificationConstant';
import { JwtService } from '@nestjs/jwt';
import { LoginStudentDto } from './dto/LoginStudentDto';
import { Student } from '../students/entity/Student';

@Injectable()
export class AuthService {
  constructor(
    private readonly studentService: StudentsService,
    private readonly verificationService: VerificationService,
    private readonly jwtService: JwtService,
  ) {}

  async registerStudent(student: RegisterStudentDto) {
    const studentExist = await this.studentService.findByEmail(student.email);

    if (studentExist) {
      throw new ConflictException({
        message: {
          title: 'Email Already in Use.',
          message:
            'An account with this email already exists. Try signing in instead.',
        },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(student.password, salt);
    const { otp, otpHash } = await this.verificationService.generateOtp();
    const savedStudent = await this.studentService.createStudent({
      ...student,
      passwordHash,
      otpHash,
      otpLastSentAt: new Date(),
    });

    const token = await this.verificationService.generateToken({
      id: savedStudent.id,
      purpose: VerificationPurpose.VERIFY_EMAIL,
    });

    // send otp and token via email

    return {
      data: { token, otp },
      message: 'Verification code sent to your email',
    };
  }

  async verifyStudentEmail({ token, otp }: { token: string; otp: string }) {
    const { id } = await this.verificationService.verifyToken({
      token,
      purpose: VerificationPurpose.VERIFY_EMAIL,
    });

    const student = await this.studentService.findByIdNoError(id);
    if (!student) {
      throw new NotFoundException('Invalid token');
    }

    if (student.isVerifiedEmail) {
      throw new BadRequestException({
        message: {
          title: 'Account Already Verfied.',
          message: 'Please proceed to login.',
        },
      });
    }

    await this.verificationService.verifyOtp({
      otp,
      otpHash: student.otpHash,
    });

    student.isVerifiedEmail = true;
    student.otpHash = null;
    student.otpLastSentAt = null;

    await this.studentService.save(student);

    return {
      message: 'Email verified successfully. Proceed to log in.',
    };
  }

  async resendVerifyEmailOtp(email: string) {
    const student = await this.studentService.findByEmail(email);
    if (!student) {
      throw new NotFoundException({
        message: {
          title: 'Code Sent',
          message: 'If email exist, a mail will be sent to it.',
        },
      });
    }
    if (student.isVerifiedEmail) {
      throw new BadRequestException({
        message: {
          title: 'Account Already Verfied.',
          message: 'Please proceed to login.',
        },
      });
    }

    this.verificationService.canResendOtp(student.otpLastSentAt);
    const { otp, otpHash } = await this.verificationService.generateOtp();

    const token = await this.verificationService.generateToken({
      id: student.id,
      purpose: VerificationPurpose.VERIFY_EMAIL,
    });

    student.otpHash = otpHash;
    student.otpLastSentAt = new Date();
    await this.studentService.save(student);

    // send mail

    return {
      data: { token, otp },
      message: 'Verification code re-sent to your email',
    };
  }

  async forgotPassword(email: string) {
    const student = await this.studentService.findByEmail(email);
    if (!student) {
      throw new NotFoundException(
        'Your email is not verified. Please verify your email before resetting your password.',
      );
    }
    if (!student.isVerifiedEmail) {
      throw new BadRequestException(
        'Your email is not verified. Please verify your email before resetting your password.',
      );
    }

    const token = await this.verificationService.generateToken({
      id: student.id,
      purpose: VerificationPurpose.FORGOT_PASSWORD,
    });

    student.resetPasswordToken = token;
    await this.studentService.save(student);

    // send mail

    return {
      data: { token },
      message: 'Reset password link sent to your email.',
    };
  }

  async loginStudent({ email, password }: LoginStudentDto) {
    const student = await this.studentService.findByEmail(email);
    if (!student) {
      throw new UnauthorizedException(
        'The email or password you entered is incorrect. Please check and try again.',
      );
    }
    if (!student.isVerifiedEmail) {
      throw new ForbiddenException(
        'Please verify your account before logging in.',
      );
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      student.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'The email or password you entered is incorrect. Please check and try again.',
      );
    }
    // create accesstoken and refresh token and use symmetric or assymetric keys
    const accessToken = await this.jwtService.signAsync({ sub: student.id });
    return { accessToken };
  }

  //   i need to reset the refresh token here
  async changeForgottenPassword({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }) {
    const { id } = await this.verificationService.verifyToken({
      token,
      purpose: VerificationPurpose.FORGOT_PASSWORD,
    });

    const student = await this.studentService.findByIdNoError(id);

    if (!student) {
      throw new NotFoundException('Invalid token');
    }

    if (!student.isVerifiedEmail) {
      throw new BadRequestException('Verify your email.');
    }

    if (!student.resetPasswordToken) {
      throw new BadRequestException(
        'You do not have an active password reset link.',
      );
    }

    if (student.resetPasswordToken !== token) {
      throw new BadRequestException('Invalid reset password link.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    student.passwordHash = passwordHash;
    student.resetPasswordToken = null;

    await this.studentService.save(student);

    return {
      message: 'Password changed successfully',
    };
  }

  async getCurrentStudent(student: Student) {
    return { id: student.id, email: student.email };
  }
}
