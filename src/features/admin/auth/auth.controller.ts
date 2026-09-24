import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/RegisterAdminDto';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new admin.
   * The very first admin created on the platform is automatically
   * assigned the SUPER_ADMIN role; later admins get the ADMIN role.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new admin' })
  @ApiResponse({
    status: 201,
    description: 'Super-Admin registered successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid email or password.' })
  @ApiResponse({ status: 409, description: 'Invalid email or password.' })
  registerAdmin(@Body() admin: RegisterAdminDto) {
    return this.authService.registerAdmin(admin);
  }
}
