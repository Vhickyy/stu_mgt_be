import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminJwtPayload } from '../decorators/current_user.decorator';
import { AdminService } from '../../admin/admin.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(
  Strategy,
  'student-jwt',
) {
  constructor(
    configService: ConfigService,
    private readonly adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ADMIN_JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: AdminJwtPayload) {
    // const admin = await this.adminService.findByIdNoError(payload.sub);

    // if (!admin) {
    //   throw new UnauthorizedException('Admin account not found');
    // }

    // const { id, email, profile } = admin;
    // return { id, email, profile };
    return true;
  }
}
