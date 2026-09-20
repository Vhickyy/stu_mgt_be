import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { VerificationService } from 'src/features/shared/verification/verification.service';
import { VerificationPurpose } from 'src/features/shared/verification/contants/VerificationConstant';
import * as bcrypt from 'bcrypt';
import { RegisterAdminDto } from './dto/RegisterAdminDto';
import { LoginAdminDto } from './dto/LoginAdminDto';
import { AdminRole } from '../enums/admin_role_enum';
import { RoleService } from '../role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly verificationService: VerificationService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
  ) {}

  async registerAdmin(admin: RegisterAdminDto) {
    const adminExist = await this.adminService.findByEmail(admin.email);

    if (adminExist) {
      throw new ConflictException(
        'An account with this email already exists. Try signing in instead.',
      );
    }

    const isFirstAdmin = await this.adminService.hasAnyAdmin();

    const role = await this.roleService.findByName(
      isFirstAdmin ? AdminRole.SUPER_ADMIN : AdminRole.ADMIN,
    );

    if (!role) {
      throw new InternalServerErrorException(
        'Admin role configuration is missing.',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(admin.password, salt);
    const savedAdmin = await this.adminService.createAdmin({
      ...admin,
      passwordHash,
      role,
    });

    const token = await this.verificationService.generateToken({
      id: savedAdmin.id,
      purpose: VerificationPurpose.VERIFY_EMAIL,
    });

    // send otp and token via email and generate token link

    return {
      data: { token },
      message: 'Verification link sent to your email',
    };
  }

  async loginAdmin({ email, password }: LoginAdminDto) {
    const admin = await this.adminService.findByEmail(email);
    if (!admin) {
      throw new UnauthorizedException('Invalid Credentials.');
    }
    if (!admin.isVerifiedEmail) {
      throw new ForbiddenException(
        'Please verify your account before logging in.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'The email or password you entered is incorrect. Please check and try again.',
      );
    }
    // create accesstoken and refresh token and use symmetric or assymetric keys
    const accessToken = await this.jwtService.signAsync({ sub: admin.id });
    return { accessToken };
  }
}
