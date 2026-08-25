import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StudentProfileDto } from '../../student_profiles/dto/StudentProfileDTO';

export class RegisterStudentDto {
  @ApiProperty({
    example: 'victoria@example.com',
    description: 'Student email address',
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
    description: 'Student profile information',
  })
  @ValidateNested()
  @Type(() => StudentProfileDto)
  profile!: StudentProfileDto;
}
