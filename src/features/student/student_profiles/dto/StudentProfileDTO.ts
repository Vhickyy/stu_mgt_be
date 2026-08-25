import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class StudentProfileDto {
  @ApiProperty({
    example: 'Victoria Okonnah',
    description: 'Student full name',
  })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({
    example: '+2348012345678',
    description: 'Phone number including country code',
  })
  @IsString()
  //   @Matches(/^\+[1-9]\d{7,14}$/, {
  //     message: 'Phone number must include a valid country code',
  //   })
  phoneNumber!: string;

  @ApiProperty({
    example: 'University of Uyo',
    description: 'Student university',
  })
  @IsString()
  @IsNotEmpty()
  university!: string;

  @ApiProperty({
    example: 2024,
    description: 'Year the student was admitted',
  })
  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear())
  admissionYear!: number;
}
