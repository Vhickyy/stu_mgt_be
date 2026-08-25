import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get<string>('STUDENT_JWT_ACCESS_SECRET'),
    signOptions: {
      expiresIn: config.get<string>('STUDENT_JWT_ACCESS_EXPIRES_IN') as any,
    },
  }),
};

export default jwtConfig;
