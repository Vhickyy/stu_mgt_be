import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SuperAdminProfileDto } from './SuperAdminProfileDto';

export class RegisterAdminDto {
  @ApiProperty({
    example: 'victoria@example.com',
    description: 'Admin email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    example: 'StrongPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  confirmPassword!: string;

  @ApiProperty({
    type: () => SuperAdminProfileDto,
    description: 'Admin profile information',
  })
  @ValidateNested()
  @Type(() => SuperAdminProfileDto)
  profile!: SuperAdminProfileDto;
}
