import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StudentsService } from '../../students/students.service';
import { StudentJwtPayload } from '../decorators/current_user.decorator';

@Injectable()
export class StudentJwtStrategy extends PassportStrategy(
  Strategy,
  'student-jwt',
) {
  constructor(
    configService: ConfigService,
    private readonly studentService: StudentsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('STUDENT_JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: StudentJwtPayload) {
    const student = await this.studentService.findByIdNoError(payload.sub);

    if (!student) {
      throw new UnauthorizedException('Student account not found');
    }

    const { id, email, profile } = student;
    return { id, email, profile };
  }
}
