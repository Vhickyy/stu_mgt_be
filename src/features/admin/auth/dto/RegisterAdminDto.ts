import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StudentProfileDto } from 'src/features/student/student_profiles/dto/StudentProfileDTO';

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
    type: () => StudentProfileDto,
    description: 'Admin profile information',
  })
  @ValidateNested()
  @Type(() => StudentProfileDto)
  profile!: StudentProfileDto;
}
