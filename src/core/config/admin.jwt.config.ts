import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const adminJwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get<string>('ADMIN_JWT_ACCESS_SECRET'),
    signOptions: {
      expiresIn: config.get<string>('ADMIN_JWT_ACCESS_EXPIRES_IN') as any,
    },
  }),
};

export default adminJwtConfig;
