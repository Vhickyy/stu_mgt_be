import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterStudentDto } from './dto/RegisterStudentDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginStudentDto } from './dto/LoginStudentDto';
import { log } from 'node:console';
import {
  ResendVerifyEmailtDto,
  VerifyStudentEmailtDto,
} from './dto/VerifyStudentEmailDto';
import { StudentJwtAuthGuard } from './gaurds/student.jwt.gaurd';
import { Student } from '../students/entity/Student';
import { CurrentStudent } from './decorators/current_user.decorator';

@ApiTags('Student Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Student Registers.',
  })
  @ApiResponse({
    status: 201,
    description: 'Registered successfully, email verification sent',
  })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  registerStudent(@Body() student: RegisterStudentDto) {
    return this.authService.registerStudent(student);
  }

  @Post('login')
  loginStudent(@Body() student: LoginStudentDto) {
    return this.authService.loginStudent(student);
  }

  @Post('very-email')
  verifyStudent(@Body() verification: VerifyStudentEmailtDto) {
    return this.authService.verifyStudentEmail(verification);
  }

  @Post('resend-email-otp')
  resendVerifyEmailOtp(@Body() resendData: ResendVerifyEmailtDto) {
    return this.authService.resendVerifyEmailOtp(resendData.email);
  }

  @Post('forgot-password')
  forgotPassword(@Body() email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('change-password')
  changePassword(
    @Body() { token, newPassword }: { token: string; newPassword: string },
  ) {
    return this.authService.changeForgottenPassword({ token, newPassword });
  }

  @Get('current-user')
  @UseGuards(StudentJwtAuthGuard)
  getCurrentUser(@CurrentStudent() student: Student) {
    return this.authService.getCurrentStudent(student);
  }
}
